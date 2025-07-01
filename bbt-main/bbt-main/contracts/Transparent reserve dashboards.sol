// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BBTReserveDashboard {
    address public bbtToken;
    address public reserveToken; // ckBTC equivalent on Avalanche
    address public oracle;
    
    struct ReserveData {
        uint totalBBT;
        uint totalReserves;
        uint collateralRatio;
        uint lastUpdate;
    }
    
    ReserveData public currentReserves;
    ReserveData[] public historicalReserves;
    
    event ReserveUpdate(uint timestamp, uint bbtSupply, uint reserveBalance, uint ratio);
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Not oracle");
        _;
    }
    
    constructor(address _bbtToken, address _reserveToken, address _oracle) {
        bbtToken = _bbtToken;
        reserveToken = _reserveToken;
        oracle = _oracle;
    }
    
    function updateReserves() public onlyOracle {
        uint bbtSupply = IERC20(bbtToken).totalSupply();
        uint reserveBalance = IERC20(reserveToken).balanceOf(address(this));
        uint ratio = reserveBalance * 100 / bbtSupply;
        
        currentReserves = ReserveData({
            totalBBT: bbtSupply,
            totalReserves: reserveBalance,
            collateralRatio: ratio,
            lastUpdate: block.timestamp
        });
        
        historicalReserves.push(currentReserves);
        emit ReserveUpdate(block.timestamp, bbtSupply, reserveBalance, ratio);
    }
    
    function getHistoricalReserves(uint count) public view returns (ReserveData[] memory) {
        if (count > historicalReserves.length) {
            count = historicalReserves.length;
        }
        
        ReserveData[] memory result = new ReserveData[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = historicalReserves[historicalReserves.length - 1 - i];
        }
        
        return result;
    }
    
    function getReserveStatus() public view returns (
        uint totalBBT,
        uint totalReserves,
        uint collateralRatio,
        uint lastUpdate
    ) {
        return (
            currentReserves.totalBBT,
            currentReserves.totalReserves,
            currentReserves.collateralRatio,
            currentReserves.lastUpdate
        );
    }
}