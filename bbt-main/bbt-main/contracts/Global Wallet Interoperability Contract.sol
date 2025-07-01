// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract BBTBridge {
    using ECDSA for bytes32;
    
    IERC20 public bbtToken;
    address public owner;
    uint public chainId;
    
    mapping(bytes32 => bool) public processedTransactions;
    mapping(address => uint) public minBridgeAmounts;
    mapping(address => uint) public maxBridgeAmounts;
    
    event BridgeInitialized(uint chainId);
    event TokensLocked(address indexed sender, uint amount, uint targetChain, string targetAddress);
    event TokensUnlocked(address indexed recipient, uint amount, bytes32 sourceTxHash);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _bbtToken, uint _chainId) {
        bbtToken = IERC20(_bbtToken);
        owner = msg.sender;
        chainId = _chainId;
        emit BridgeInitialized(_chainId);
    }
    
    function lockTokens(uint amount, uint targetChain, string calldata targetAddress) external {
        require(amount > 0, "Amount must be positive");
        require(targetChain != chainId, "Cannot bridge to same chain");
        require(bytes(targetAddress).length > 0, "Invalid target address");
        
        if (minBridgeAmounts[msg.sender] > 0) {
            require(amount >= minBridgeAmounts[msg.sender], "Below minimum bridge amount");
        }
        
        if (maxBridgeAmounts[msg.sender] > 0) {
            require(amount <= maxBridgeAmounts[msg.sender], "Above maximum bridge amount");
        }
        
        require(bbtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit TokensLocked(msg.sender, amount, targetChain, targetAddress);
    }
    
    function unlockTokens(
        address recipient,
        uint amount,
        bytes32 sourceTxHash,
        bytes calldata signature
    ) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(!processedTransactions[sourceTxHash], "Transaction already processed");
        
        bytes32 messageHash = keccak256(abi.encodePacked(
            recipient,
            amount,
            sourceTxHash,
            chainId
        ));
        
        address signer = messageHash.toEthSignedMessageHash().recover(signature);
        require(signer == owner, "Invalid signature");
        
        processedTransactions[sourceTxHash] = true;
        require(bbtToken.transfer(recipient, amount), "Transfer failed");
        
        emit TokensUnlocked(recipient, amount, sourceTxHash);
    }
    
    function setBridgeLimits(address user, uint minAmount, uint maxAmount) external onlyOwner {
        require(minAmount <= maxAmount, "Invalid limits");
        minBridgeAmounts[user] = minAmount;
        maxBridgeAmounts[user] = maxAmount;
    }
    
    function withdrawTokens(address token, uint amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }
}