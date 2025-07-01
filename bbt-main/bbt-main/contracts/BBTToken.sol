// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract BBTToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    // Token configuration
    uint8 private _decimals;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**8; // 1 billion BBT with 8 decimals
    
    // Reserve token (WAVAX for testnet, WBTC for mainnet)
    address public reserveToken;
    
    // Stabilizer contract
    address public stabilizerContract;
    
    // Fees (in basis points: 100 = 1%)
    uint256 public mintFee = 10; // 0.1%
    uint256 public burnFee = 10; // 0.1%
    
    // Collateralization ratios (in basis points: 15000 = 150%)
    uint256 public minCollateralRatio = 15000; // 150%
    uint256 public targetCollateralRatio = 20000; // 200%
    uint256 public maxCollateralRatio = 30000; // 300%
    
    // Emergency controls
    bool public emergencyMode;
    address public oracle;
    
    // Events
    event Mint(address indexed user, uint256 bbtAmount, uint256 reserveAmount, uint256 fee);
    event Burn(address indexed user, uint256 bbtAmount, uint256 reserveAmount, uint256 fee);
    event FeeUpdated(uint256 mintFee, uint256 burnFee);
    event CollateralRatioUpdated(uint256 min, uint256 target, uint256 max);
    event EmergencyModeToggled(bool enabled);
    event OracleUpdated(address indexed newOracle);
    event StabilizerUpdated(address indexed newStabilizer);
    
    modifier onlyStabilizer() {
        require(msg.sender == stabilizerContract, "BBT: Only stabilizer can call");
        _;
    }
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "BBT: Only oracle can call");
        _;
    }
    
    modifier notEmergency() {
        require(!emergencyMode, "BBT: Emergency mode active");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        address _reserveToken,
        address _oracle
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        reserveToken = _reserveToken;
        oracle = _oracle;
        
        // Mint initial supply to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**decimals_); // 1M BBT
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Core minting function
    function mint(address to, uint256 amount) external onlyStabilizer whenNotPaused {
        require(to != address(0), "BBT: Cannot mint to zero address");
        require(amount > 0, "BBT: Amount must be positive");
        require(totalSupply() + amount <= MAX_SUPPLY, "BBT: Exceeds max supply");
        
        _mint(to, amount);
    }
    
    // Core burning function
    function burn(address from, uint256 amount) external onlyStabilizer whenNotPaused {
        require(from != address(0), "BBT: Cannot burn from zero address");
        require(amount > 0, "BBT: Amount must be positive");
        
        _burn(from, amount);
    }
    
    // Public mint function (for users)
    function mintBBT(uint256 reserveAmount) external nonReentrant whenNotPaused notEmergency {
        require(reserveAmount > 0, "BBT: Amount must be positive");
        
        uint256 fee = (reserveAmount * mintFee) / 10000;
        uint256 mintAmount = reserveAmount - fee;
        
        // Check collateral ratio
        require(getCurrentCollateralRatio() >= minCollateralRatio, "BBT: Collateral ratio too low");
        
        // Transfer reserve tokens from user
        require(
            IERC20(reserveToken).transferFrom(msg.sender, address(this), reserveAmount),
            "BBT: Reserve transfer failed"
        );
        
        // Mint BBT tokens to user
        _mint(msg.sender, mintAmount);
        
        emit Mint(msg.sender, mintAmount, reserveAmount, fee);
    }
    
    // Public burn function (for users)
    function burnBBT(uint256 bbtAmount) external nonReentrant whenNotPaused notEmergency {
        require(bbtAmount > 0, "BBT: Amount must be positive");
        
        uint256 fee = (bbtAmount * burnFee) / 10000;
        uint256 burnAmount = bbtAmount - fee;
        
        // Check collateral ratio
        require(getCurrentCollateralRatio() <= maxCollateralRatio, "BBT: Collateral ratio too high");
        
        // Burn BBT tokens from user
        _burn(msg.sender, bbtAmount);
        
        // Transfer reserve tokens to user
        require(
            IERC20(reserveToken).transfer(msg.sender, burnAmount),
            "BBT: Reserve transfer failed"
        );
        
        emit Burn(msg.sender, bbtAmount, burnAmount, fee);
    }
    
    // Get current collateralization ratio
    function getCurrentCollateralRatio() public view returns (uint256) {
        uint256 reserveBalance = IERC20(reserveToken).balanceOf(address(this));
        uint256 bbtSupply = totalSupply();
        
        if (bbtSupply == 0) return type(uint256).max;
        return (reserveBalance * 10000) / bbtSupply;
    }
    
    // Get reserve balance
    function getReserveBalance() external view returns (uint256) {
        return IERC20(reserveToken).balanceOf(address(this));
    }
    
    // Admin functions
    function setStabilizer(address _stabilizer) external onlyOwner {
        require(_stabilizer != address(0), "BBT: Invalid stabilizer address");
        stabilizerContract = _stabilizer;
        emit StabilizerUpdated(_stabilizer);
    }
    
    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "BBT: Invalid oracle address");
        oracle = _oracle;
        emit OracleUpdated(_oracle);
    }
    
    function setFees(uint256 _mintFee, uint256 _burnFee) external onlyOracle {
        require(_mintFee <= 1000, "BBT: Mint fee too high"); // Max 10%
        require(_burnFee <= 1000, "BBT: Burn fee too high"); // Max 10%
        
        mintFee = _mintFee;
        burnFee = _burnFee;
        emit FeeUpdated(_mintFee, _burnFee);
    }
    
    function setCollateralRatios(uint256 _min, uint256 _target, uint256 _max) external onlyOracle {
        require(_min <= _target && _target <= _max, "BBT: Invalid ratios");
        require(_min >= 11000, "BBT: Minimum ratio too low"); // At least 110%
        
        minCollateralRatio = _min;
        targetCollateralRatio = _target;
        maxCollateralRatio = _max;
        emit CollateralRatioUpdated(_min, _target, _max);
    }
    
    function toggleEmergencyMode(bool enabled) external onlyOracle {
        emergencyMode = enabled;
        emit EmergencyModeToggled(enabled);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency functions
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "BBT: Withdraw failed");
    }
    
    // Test functions (for testnet only)
    function testMint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "BBT: Cannot mint to zero address");
        require(amount > 0, "BBT: Amount must be positive");
        require(totalSupply() + amount <= MAX_SUPPLY, "BBT: Exceeds max supply");
        
        _mint(to, amount);
    }
    
    function testBurn(address from, uint256 amount) external onlyOwner {
        require(from != address(0), "BBT: Cannot burn from zero address");
        require(amount > 0, "BBT: Amount must be positive");
        
        _burn(from, amount);
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
} 