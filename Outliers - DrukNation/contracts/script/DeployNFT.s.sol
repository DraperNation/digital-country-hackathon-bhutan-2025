// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/BhutanEResidencyNFT.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        BhutanEResidencyNFT platform = new BhutanEResidencyNFT(0x4263cb34A554B2D50b7300C0bC9fE073f1d4B38e); // Fee recipient
        
        vm.stopBroadcast();
    }
}