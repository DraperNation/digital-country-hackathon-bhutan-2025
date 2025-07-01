// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title BorrowRegistry
/// @notice Tracks borrow, repayment, and default history for suppliers
contract BorrowRegistry is Ownable {
    address public lendingPool;

    mapping(address => uint256) public defaults;
    mapping(address => uint256) public lateRepayments;
    mapping(address => uint256) public successfulLoans;

    modifier onlyLendingPool() {
        require(msg.sender == lendingPool, "Only LendingPool can call");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /// @notice Sets the LendingPool address
    /// @param _lendingPool The address of the LendingPool contract
    function setLendingPool(address _lendingPool) external onlyOwner {
        lendingPool = _lendingPool;
    }

    /// @notice Record a new borrow event
    function recordBorrow(address supplier, uint256 invoiceId) external onlyLendingPool {
        // Optionally track open loans if needed
    }

    /// @notice Record a repayment event
    /// @param wasLate True if repayment was late
    function recordRepayment(address supplier, uint256 invoiceId, bool wasLate) external onlyLendingPool {
        if (wasLate) {
            lateRepayments[supplier] += 1;
        } else {
            successfulLoans[supplier] += 1;
        }
    }

    /// @notice Record a default event
    function recordDefault(address supplier, uint256 invoiceId) external onlyLendingPool {
        defaults[supplier] += 1;
    }

    /// @notice Get the number of defaults for a supplier
    function getDefaults(address supplier) external view returns (uint256) {
        return defaults[supplier];
    }

    /// @notice Get the number of late repayments for a supplier
    function getLateRepayments(address supplier) external view returns (uint256) {
        return lateRepayments[supplier];
    }

    /// @notice Get the number of successful loans for a supplier
    function getSuccessfulLoans(address supplier) external view returns (uint256) {
        return successfulLoans[supplier];
    }
} 