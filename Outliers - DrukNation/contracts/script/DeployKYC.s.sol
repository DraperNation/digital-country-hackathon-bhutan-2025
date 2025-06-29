//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/BhutanKYCPlatform.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        BhutanKYCPlatform platform = new BhutanKYCPlatform(); // Fee recipient
        
        vm.stopBroadcast();
    }
}