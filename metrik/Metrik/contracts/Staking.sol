// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./mocks/MockERC20.sol";

/**
 * @title Staking
 * @dev Handles METRIK token staking and tier system
 */
contract Staking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Custom Errors
    error StakingPeriodNotEnded();
    error NoStakeFound();
    error InvalidAmount();
    error InvalidDuration();
    error AlreadyStaked();

    // Constants
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant POINTS_PER_TOKEN = 1;
    uint256 public constant DURATION_MULTIPLIER = 2; // 2x points for longer staking
    uint256 public constant BRONZE_TIER_MIN = 1000 * 1e18;
    uint256 public constant SILVER_TIER_MIN = 2500 * 1e18;
    uint256 public constant GOLD_TIER_MIN = 5000 * 1e18;
    uint256 public constant DIAMOND_TIER_MIN = 10000 * 1e18;

    // State variables
    IERC20 public immutable metrikToken;
    uint256 public totalStaked;
    uint256 public totalPoints;

    struct StakeInfo {
        uint256 amount;
        uint256 points;
        uint256 startTime;
        uint256 lastUpdateTime;
        uint256 duration;
    }

    struct StakeRecord {
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        uint256 usedForBorrow; // amount of this stake currently locked as collateral
    }

    // Mappings
    mapping(address => StakeInfo[]) public stakes;
    mapping(address => uint256) public userPoints;
    mapping(address => StakeRecord[]) public stakeHistory;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 amount);
    event PointsUpdated(address indexed user, uint256 points);
    event TokensSlashed(address indexed user, uint256 amount);
    event DebugLog(string message, address indexed user);

    constructor(address _metrikToken) Ownable(msg.sender) {
        metrikToken = IERC20(_metrikToken);
    }

    /**
     * @dev Stake METRIK tokens
     * @param amount Amount of tokens to stake
     * @param duration Staking duration in seconds
     */
    function stake(uint256 amount, uint256 duration) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        if (duration < 3 minutes) revert InvalidDuration();
        if (duration > 365 days) revert InvalidDuration();

        metrikToken.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate points with duration multiplier
        uint256 points = amount * POINTS_PER_TOKEN;
        if (duration >= 180 days) {
            points = points * DURATION_MULTIPLIER;
        }

        // Add new stake info
        stakes[msg.sender].push(StakeInfo({
            amount: amount,
            points: points,
            startTime: block.timestamp,
            lastUpdateTime: block.timestamp,
            duration: duration
        }));

        // Add to stake history
        stakeHistory[msg.sender].push(StakeRecord({
            amount: amount,
            startTime: block.timestamp,
            duration: duration,
            usedForBorrow: 0
        }));

        // Update totals
        totalStaked += amount;
        totalPoints += points;
        userPoints[msg.sender] += points;

        emit Staked(msg.sender, amount, duration);
        emit PointsUpdated(msg.sender, userPoints[msg.sender]);
    }

    /**
     * @dev Unstake METRIK tokens
     */
    function unstake(uint256 index) external nonReentrant {
        require(index < stakes[msg.sender].length, "Invalid stake index");
        StakeInfo storage stakeInfo = stakes[msg.sender][index];
        if (stakeInfo.amount == 0) revert NoStakeFound();
        if (block.timestamp < stakeInfo.startTime + stakeInfo.duration) revert StakingPeriodNotEnded();

        _updatePoints(msg.sender, index);

        uint256 amount = stakeInfo.amount;
        uint256 points = stakeInfo.points;

        // Update totals
        totalStaked -= amount;
        totalPoints -= points;
        userPoints[msg.sender] -= points;

        // Remove stake info (set to zero)
        stakeInfo.amount = 0;
        stakeInfo.points = 0;
        stakeInfo.startTime = 0;
        stakeInfo.lastUpdateTime = 0;
        stakeInfo.duration = 0;

        // Transfer tokens back
        metrikToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
        emit PointsUpdated(msg.sender, userPoints[msg.sender]);
    }

    /**
     * @dev Update points for a user
     * @param user Address of the user
     */
    function _updatePoints(address user, uint256 index) internal {
        StakeInfo storage stakeInfo = stakes[user][index];
        if (stakeInfo.amount == 0) return;

        uint256 timeElapsed = block.timestamp - stakeInfo.lastUpdateTime;
        uint256 additionalPoints = (stakeInfo.points * timeElapsed) / stakeInfo.duration;

        stakeInfo.points += additionalPoints;
        stakeInfo.lastUpdateTime = block.timestamp;
        userPoints[user] += additionalPoints;
        totalPoints += additionalPoints;

        emit PointsUpdated(user, userPoints[user]);
    }

    /**
     * @dev Get user's staking tier
     * @param user Address of the user
     * @return Tier
     */
    function getTier(address user) public view returns (uint8) {
        uint256 stakedAmount = getStakedAmount(user);
        if (stakedAmount >= DIAMOND_TIER_MIN) {
            return 4; // Diamond
        } else if (stakedAmount >= GOLD_TIER_MIN) {
            return 3; // Gold
        } else if (stakedAmount >= SILVER_TIER_MIN) {
            return 2; // Silver
        } else if (stakedAmount >= BRONZE_TIER_MIN) {
            return 1; // Bronze
        }
        return 0; // No tier
    }

    /**
     * @dev Get user's staked amount
     * @param user Address of the user
     * @return Staked amount
     */
    function getStakedAmount(address user) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < stakes[user].length; i++) {
            total += stakes[user][i].amount;
        }
        return total;
    }

    /**
     * @dev Get user's stake duration in days
     * @param user Address of the user
     * @return Duration in days
     */
    function getStakeDuration(address user) external view returns (uint256) {
        // Return the max duration among all active stakes (or sum, if needed)
        uint256 maxDuration = 0;
        for (uint256 i = 0; i < stakes[user].length; i++) {
            if (stakes[user][i].duration > maxDuration) {
                maxDuration = stakes[user][i].duration;
            }
        }
        return maxDuration / 1 days;
    }

    /**
     * @dev Slash staked tokens (called by LendingPool)
     * @param user Address of the user
     */
    function slashStakedTokens(address user) external onlyOwner {
        StakeInfo storage stakeInfo = stakes[user][0];
        require(stakeInfo.amount > 0, "No stake found");

        uint256 amount = stakeInfo.amount;
        uint256 points = stakeInfo.points;

        // Update totals
        totalStaked -= amount;
        totalPoints -= points;
        userPoints[user] -= points;

        // Clear stake info
        stakeInfo.amount = 0;
        stakeInfo.points = 0;
        stakeInfo.startTime = 0;
        stakeInfo.lastUpdateTime = 0;
        stakeInfo.duration = 0;

        // Debug log before burning
        emit DebugLog("Before burning", user);

        // Burn the slashed tokens
        MockERC20(address(metrikToken)).burn(amount);

        // Debug log after burning
        emit DebugLog("After burning", user);

        emit TokensSlashed(user, amount);
        emit PointsUpdated(user, userPoints[user]);
    }

    /**
     * @dev Get user's stake info
     * @param user Address of the user
     * @return amount Stake amount
     * @return points Points
     * @return startTime Start time
     * @return lastUpdateTime Last update time
     * @return duration Duration
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 points,
        uint256 startTime,
        uint256 lastUpdateTime,
        uint256 duration
    ) {
        StakeInfo storage stakeInfo = stakes[user][0];
        return (
            stakeInfo.amount,
            stakeInfo.points,
            stakeInfo.startTime,
            stakeInfo.lastUpdateTime,
            stakeInfo.duration
        );
    }

    // New function: update usedForBorrow for a user's stake records (FIFO)
    function updateStakeUsage(address user, uint256 amount, bool increase) external onlyOwner {
        // Only LendingPool (owner) can call
        StakeRecord[] storage records = stakeHistory[user];
        uint256 remaining = amount;
        for (uint256 i = 0; i < records.length && remaining > 0; i++) {
            uint256 available = increase
                ? records[i].amount - records[i].usedForBorrow
                : records[i].usedForBorrow;
            uint256 delta = available < remaining ? available : remaining;
            if (increase) {
                records[i].usedForBorrow += delta;
            } else {
                records[i].usedForBorrow -= delta;
            }
            remaining -= delta;
        }
    }

    // Helper to get total staked, used, and free for a user
    function getStakeUsage(address user) external view returns (uint256 total, uint256 used, uint256 free) {
        StakeRecord[] storage records = stakeHistory[user];
        for (uint256 i = 0; i < records.length; i++) {
            total += records[i].amount;
            used += records[i].usedForBorrow;
        }
        free = total - used;
    }

    // Helper to get the length of stake history for a user
    function getStakeHistoryLength(address user) external view returns (uint256) {
        return stakeHistory[user].length;
    }

    // Add a function to get all active stakes for a user
    function getActiveStakes(address user) external view returns (StakeInfo[] memory) {
        return stakes[user];
    }
} 