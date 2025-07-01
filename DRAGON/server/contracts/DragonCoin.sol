// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

/**
 * @title DragonCoin
 * @dev Dragon Coin: A stablecoin backed by Bhutan's Bitcoin reserves
 */
contract DragonCoin is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {    // Create roles
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    // State variables for backing
    uint256 public bitcoinReserves; // Satoshi amount of BTC reserves
    uint256 public collateralRatio; // How much BTC backs each coin (in basis points, 10000 = 100%)
    uint256 public exchangeRate;    // How many USD cents per satoshi

    // Events
    event ReservesUpdated(uint256 newReserves);
    event CollateralRatioUpdated(uint256 newRatio);
    event ExchangeRateUpdated(uint256 newRate);

    /**
     * @dev Constructor to initialize Dragon Coin
     */
    constructor() ERC20("DragonCoin", "DRGC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        
        // Initial settings
        collateralRatio = 10000; // 100% backed initially
        exchangeRate = 3000;     // 30 USD cents per satoshi (example value)
        bitcoinReserves = 0;     // Start with 0 BTC reserves
    }    /**
     * @dev Mint new tokens
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        // Calculate how many satoshis are required to back this mint
        uint256 requiredSatoshis = (amount * 10000) / (collateralRatio * exchangeRate);
        
        // Ensure we have enough reserves
        require(bitcoinReserves >= requiredSatoshis, "Insufficient Bitcoin reserves");
        
        _mint(to, amount);
    }

    /**
     * @dev Pause all token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause all token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Update the Bitcoin reserves
     * @param newReserves The new amount of Bitcoin reserves in satoshis
     */
    function updateReserves(uint256 newReserves) public onlyRole(ORACLE_ROLE) {
        bitcoinReserves = newReserves;
        emit ReservesUpdated(newReserves);
    }

    /**
     * @dev Update the collateral ratio
     * @param newRatio The new collateral ratio in basis points (10000 = 100%)
     */
    function updateCollateralRatio(uint256 newRatio) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRatio > 0, "Collateral ratio must be greater than 0");
        collateralRatio = newRatio;
        emit CollateralRatioUpdated(newRatio);
    }

    /**
     * @dev Update the BTC/USD exchange rate
     * @param newRate The new exchange rate in USD cents per satoshi
     */
    function updateExchangeRate(uint256 newRate) public onlyRole(ORACLE_ROLE) {
        require(newRate > 0, "Exchange rate must be greater than 0");
        exchangeRate = newRate;
        emit ExchangeRateUpdated(newRate);
    }

    /**
     * @dev Calculate the maximum amount of tokens that can be minted based on current reserves
     */
    function getMaxMintableAmount() public view returns (uint256) {
        return (bitcoinReserves * exchangeRate * collateralRatio) / 10000;
    }

    /**
     * @dev Calculate the current amount of tokens that can still be minted
     * @return The difference between max mintable amount and current total supply
     */
    function getCurrentMintableAmount() public view returns (uint256) {
        uint256 maxMintable = getMaxMintableAmount();
        uint256 currentSupply = totalSupply();
        
        if (currentSupply >= maxMintable) {
            return 0;
        }
        
        return maxMintable - currentSupply;
    }
    
    /**
     * @dev Override _update to include the pausable functionality
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}