// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BBTTreasury {
    address[] public owners;
    uint public requiredConfirmations;
    mapping(address => bool) public isOwner;
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint confirmations;
    }
    
    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;
    
    event Deposit(address indexed sender, uint value);
    event TransactionSubmitted(uint indexed txId, address indexed owner);
    event TransactionConfirmed(uint indexed txId, address indexed owner);
    event TransactionExecuted(uint indexed txId);
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }
    
    modifier txExists(uint _txId) {
        require(_txId < transactions.length, "TX doesn't exist");
        _;
    }
    
    modifier notExecuted(uint _txId) {
        require(!transactions[_txId].executed, "TX already executed");
        _;
    }
    
    constructor(address[] memory _owners, uint _requiredConfirmations) {
        require(_owners.length > 0, "Owners required");
        require(_requiredConfirmations > 0 && _requiredConfirmations <= _owners.length, "Invalid confirmations");
        
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        requiredConfirmations = _requiredConfirmations;
    }
    
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner {
        uint txId = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            confirmations: 0
        }));
        
        emit TransactionSubmitted(txId, msg.sender);
    }
    
    function confirmTransaction(uint _txId) public onlyOwner txExists(_txId) notExecuted(_txId) {
        require(!confirmations[_txId][msg.sender], "TX already confirmed");
        
        confirmations[_txId][msg.sender] = true;
        transactions[_txId].confirmations += 1;
        
        emit TransactionConfirmed(_txId, msg.sender);
        
        if (transactions[_txId].confirmations >= requiredConfirmations) {
            executeTransaction(_txId);
        }
    }
    
    function executeTransaction(uint _txId) internal txExists(_txId) notExecuted(_txId) {
        Transaction storage transaction = transactions[_txId];
        
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "TX failed");
        
        transaction.executed = true;
        emit TransactionExecuted(_txId);
    }
    
    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }
    
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}