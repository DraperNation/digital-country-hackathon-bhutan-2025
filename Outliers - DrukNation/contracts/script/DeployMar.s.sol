// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/BhutanLandMarketplace.sol";

contract DeployScript is Script {
    function run() external {
        
        // Replace these addresses with your deployed contract addresses
        address kycContractAddress = 0x4263cb34A554B2D50b7300C0bC9fE073f1d4B38e;
        address eResidencyContractAddress = 0x0623432b366Ee41140F0bC026d89d58416BF0aCF;
        address feeRecipient = msg.sender;
        
        vm.startBroadcast();
        
        BhutanLandMarketplace landMarketplace = new BhutanLandMarketplace(
            kycContractAddress,
            eResidencyContractAddress,
            feeRecipient
        );
        
        vm.stopBroadcast();
    }
}