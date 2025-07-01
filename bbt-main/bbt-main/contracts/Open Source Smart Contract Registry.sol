// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BBTContractRegistry {
    struct ContractInfo {
        address contractAddress;
        string name;
        string version;
        string githubUrl;
        bytes32 sourceHash;
        uint timestamp;
    }
    
    address public owner;
    ContractInfo[] public contracts;
    
    event ContractRegistered(uint indexed id, string name, string version, address contractAddress);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerContract(
        address _contract,
        string memory _name,
        string memory _version,
        string memory _githubUrl,
        bytes32 _sourceHash
    ) external onlyOwner {
        ContractInfo memory info = ContractInfo({
            contractAddress: _contract,
            name: _name,
            version: _version,
            githubUrl: _githubUrl,
            sourceHash: _sourceHash,
            timestamp: block.timestamp
        });
        
        contracts.push(info);
        emit ContractRegistered(contracts.length - 1, _name, _version, _contract);
    }
    
    function updateContract(
        uint _id,
        address _contract,
        string memory _name,
        string memory _version,
        string memory _githubUrl,
        bytes32 _sourceHash
    ) external onlyOwner {
        require(_id < contracts.length, "Invalid ID");
        
        ContractInfo storage info = contracts[_id];
        info.contractAddress = _contract;
        info.name = _name;
        info.version = _version;
        info.githubUrl = _githubUrl;
        info.sourceHash = _sourceHash;
        info.timestamp = block.timestamp;
    }
    
    function getContractCount() external view returns (uint) {
        return contracts.length;
    }
    
    function getContractInfo(uint _id) external view returns (
        address contractAddress,
        string memory name,
        string memory version,
        string memory githubUrl,
        bytes32 sourceHash,
        uint timestamp
    ) {
        require(_id < contracts.length, "Invalid ID");
        ContractInfo storage info = contracts[_id];
        return (
            info.contractAddress,
            info.name,
            info.version,
            info.githubUrl,
            info.sourceHash,
            info.timestamp
        );
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }
}