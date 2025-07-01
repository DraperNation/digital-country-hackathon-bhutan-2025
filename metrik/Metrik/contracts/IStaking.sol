// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IStaking
/// @notice Interface for Staking contract used by LendingPool
interface IStaking {
    /// @notice Get the tier of a user (0=bronze, 1=silver, ...)
    function getTier(address user) external view returns (uint8);
    /// @notice Get the staked amount of a user
    function getStakedAmount(address user) external view returns (uint256);
    /// @notice Get the stake duration of a user (in days)
    function getStakeDuration(address user) external view returns (uint256);
} 