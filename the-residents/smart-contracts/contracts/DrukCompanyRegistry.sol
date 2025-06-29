// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DrukCompanyRegistry {
    event NewEntityCreated(bytes32 companyHash, address indexed by, uint256 timestamp);

    function registerEntity(bytes32 companyHash) external {
        emit NewEntityCreated(companyHash, msg.sender, block.timestamp);
    }
} 