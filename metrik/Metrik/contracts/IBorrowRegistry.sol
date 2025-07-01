// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IBorrowRegistry
/// @notice Interface for BorrowRegistry contract
interface IBorrowRegistry {
    function recordBorrow(address supplier, uint256 invoiceId) external;
    function recordRepayment(address supplier, uint256 invoiceId, bool wasLate) external;
    function recordDefault(address supplier, uint256 invoiceId) external;
    function getDefaults(address supplier) external view returns (uint256);
    function getLateRepayments(address supplier) external view returns (uint256);
    function getSuccessfulLoans(address supplier) external view returns (uint256);
} 