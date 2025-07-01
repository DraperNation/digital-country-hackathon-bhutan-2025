// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import Chainlink's AggregatorV3Interface
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Import your custom OracleInterface
import "./OracleInterface.sol"; // Assuming OracleInterface.sol is in the same directory

/**
 * @title ChainlinkBTCOracle
 * @dev Implements OracleInterface to provide BTC/USD price using Chainlink Price Feeds.
 */
contract ChainlinkBTCOracle is OracleInterface {
    // Internal variable to store the Chainlink Price Feed contract instance
    AggregatorV3Interface internal priceFeed;

    /**
     * @dev Constructor to initialize the Chainlink price feed address.
     * @param _priceFeedAddress The address of the BTC/USD AggregatorV3Interface on the target network.
     * Example addresses for BTC/USD (8 decimals):
     * - Sepolia: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     * - Mainnet: 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c
     * - Polygon: 0xc907E116054Ad103354f2D350FD2514433D57F6f
     */
    constructor(address _priceFeedAddress) {
        // Ensure a valid address is provided
        require(_priceFeedAddress != address(0), "Price Feed address cannot be zero");
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    /**
     * @dev Internal function to get the latest raw price from Chainlink.
     * Returns the price as an int256 with 8 decimal places.
     * This function is for internal use or if you need the full Chainlink response details.
     */
    function _getLatestRawPrice() internal view returns (int256 price) {
        // latestRoundData returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
        (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound // slither-disable-line unused-return
        ) = priceFeed.latestRoundData();

        // Basic checks for data validity (consider more robust checks for production)
        require(answer > 0, "Chainlink price feed returned non-positive answer");
        // Optional: Check if price is not too old (e.g., within last 5 minutes)
        // require(block.timestamp - updatedAt < 300, "Chainlink price is stale");

        return answer;
    }

    /**
     * @dev Overrides getBTCPrice from OracleInterface.
     * Returns the latest BTC/USD price as a uint256, with 8 decimal places.
     * This is the function your VaultManager will call.
     */
    function getBTCPrice() external view override returns (uint256) {
        int256 latestPrice = _getLatestRawPrice();

        // Chainlink's price feeds usually return positive prices for crypto assets.
        // Cast int256 to uint256, ensuring no negative values (which should be caught by _getLatestRawPrice's require).
        return uint256(latestPrice);
    }

    /**
     * @dev Provides access to the underlying Chainlink price feed address.
     */
    function getChainlinkFeedAddress() external view returns (address) {
        return address(priceFeed);
    }
}