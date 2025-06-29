// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./BBTToken.sol";

contract BBTFaucet is Ownable, ReentrancyGuard {
    BBTToken public bbtToken;
    
    uint256 public dripAmount = 100 * 10**8; // 100 BBT
    uint256 public cooldownPeriod = 24 hours;
    
    mapping(address => uint256) public lastDripTime;
    
    event TokensDripped(address indexed recipient, uint256 amount);
    event DripAmountUpdated(uint256 newAmount);
    event CooldownUpdated(uint256 newCooldown);
    
    constructor(address _bbtToken) {
        bbtToken = BBTToken(_bbtToken);
    }
    
    function requestTokens() external nonReentrant {
        require(
            block.timestamp >= lastDripTime[msg.sender] + cooldownPeriod,
            "Faucet: Cooldown period not elapsed"
        );
        
        require(
            bbtToken.balanceOf(address(this)) >= dripAmount,
            "Faucet: Insufficient tokens"
        );
        
        lastDripTime[msg.sender] = block.timestamp;
        
        require(
            bbtToken.transfer(msg.sender, dripAmount),
            "Faucet: Transfer failed"
        );
        
        emit TokensDripped(msg.sender, dripAmount);
    }
    
    function setDripAmount(uint256 _dripAmount) external onlyOwner {
        require(_dripAmount > 0, "Faucet: Amount must be positive");
        dripAmount = _dripAmount;
        emit DripAmountUpdated(_dripAmount);
    }
    
    function setCooldown(uint256 _cooldown) external onlyOwner {
        require(_cooldown > 0, "Faucet: Cooldown must be positive");
        cooldownPeriod = _cooldown;
        emit CooldownUpdated(_cooldown);
    }
    
    function getNextDripTime(address user) external view returns (uint256) {
        return lastDripTime[user] + cooldownPeriod;
    }
    
    function canRequest(address user) external view returns (bool) {
        return block.timestamp >= lastDripTime[user] + cooldownPeriod;
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = bbtToken.balanceOf(address(this));
        require(
            bbtToken.transfer(owner(), balance),
            "Faucet: Withdraw failed"
        );
    }
} 