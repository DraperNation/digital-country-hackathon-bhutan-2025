// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BBTStabilizer is ReentrancyGuard {
    IERC20 public bbtToken;
    IERC20 public reserveToken;
    address public oracle;
    
    uint public mintFee = 10; // 0.1%
    uint public burnFee = 10; // 0.1%
    uint public minCollateralRatio = 150; // 150%
    uint public targetCollateralRatio = 200; // 200%
    uint public maxCollateralRatio = 300; // 300%
    
    bool public emergencyMode;
    uint public lastPriceUpdate;
    uint public currentBTCPrice;
    
    event Mint(address indexed user, uint bbtAmount, uint reserveAmount);
    event Burn(address indexed user, uint bbtAmount, uint reserveAmount);
    event EmergencyModeActivated(string reason);
    event EmergencyModeDeactivated();
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Not oracle");
        _;
    }
    
    modifier notEmergency() {
        require(!emergencyMode, "Emergency mode active");
        _;
    }
    
    constructor(address _bbtToken, address _reserveToken, address _oracle) {
        bbtToken = IERC20(_bbtToken);
        reserveToken = IERC20(_reserveToken);
        oracle = _oracle;
    }
    
    function mint(uint reserveAmount) external nonReentrant notEmergency {
        require(reserveAmount > 0, "Amount must be positive");
        
        uint fee = reserveAmount * mintFee / 10000;
        uint mintAmount = reserveAmount - fee;
        
        // Check collateral ratio
        uint currentRatio = getCurrentCollateralRatio();
        require(currentRatio >= minCollateralRatio, "Collateral ratio too low");
        
        // Transfer reserve tokens from user
        require(reserveToken.transferFrom(msg.sender, address(this), reserveAmount), "Transfer failed");
        
        // Mint BBT tokens to user
        require(bbtToken.transfer(msg.sender, mintAmount), "Mint failed");
        
        emit Mint(msg.sender, mintAmount, reserveAmount);
    }
    
    function burn(uint bbtAmount) external nonReentrant notEmergency {
        require(bbtAmount > 0, "Amount must be positive");
        
        uint fee = bbtAmount * burnFee / 10000;
        uint burnAmount = bbtAmount - fee;
        
        // Check collateral ratio
        uint currentRatio = getCurrentCollateralRatio();
        require(currentRatio <= maxCollateralRatio, "Collateral ratio too high");
        
        // Burn BBT tokens from user
        require(bbtToken.transferFrom(msg.sender, address(this), bbtAmount), "Transfer failed");
        
        // Transfer reserve tokens to user
        require(reserveToken.transfer(msg.sender, burnAmount), "Transfer failed");
        
        emit Burn(msg.sender, bbtAmount, burnAmount);
    }
    
    function updateBTCPrice(uint newPrice) external onlyOracle {
        uint priceChange = (newPrice > currentBTCPrice) ? 
            (newPrice - currentBTCPrice) * 100 / currentBTCPrice :
            (currentBTCPrice - newPrice) * 100 / currentBTCPrice;
            
        if (priceChange > 20 && !emergencyMode) {
            emergencyMode = true;
            emit EmergencyModeActivated("Price volatility >20%");
        }
        
        currentBTCPrice = newPrice;
        lastPriceUpdate = block.timestamp;
    }
    
    function toggleEmergencyMode(bool active) external onlyOracle {
        emergencyMode = active;
        if (active) {
            emit EmergencyModeActivated("Manual activation");
        } else {
            emit EmergencyModeDeactivated();
        }
    }
    
    function getCurrentCollateralRatio() public view returns (uint) {
        uint reserveBalance = reserveToken.balanceOf(address(this));
        uint bbtSupply = bbtToken.totalSupply();
        
        if (bbtSupply == 0) return type(uint).max;
        return reserveBalance * 100 / bbtSupply;
    }
    
    function adjustFees(uint newMintFee, uint newBurnFee) external onlyOracle {
        require(newMintFee <= 100, "Mint fee too high"); // Max 1%
        require(newBurnFee <= 100, "Burn fee too high"); // Max 1%
        
        mintFee = newMintFee;
        burnFee = newBurnFee;
    }
    
    function adjustCollateralRatios(uint min, uint target, uint max) external onlyOracle {
        require(min <= target && target <= max, "Invalid ratios");
        require(min >= 110, "Minimum ratio too low"); // At least 110%
        
        minCollateralRatio = min;
        targetCollateralRatio = target;
        maxCollateralRatio = max;
    }
}

