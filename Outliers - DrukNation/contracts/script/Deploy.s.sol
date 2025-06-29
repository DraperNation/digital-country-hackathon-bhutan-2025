// script/Deploy.s.sol
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/EResidencyContracts.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        EResidencyDeployer deployer = new EResidencyDeployer();
        deployer.deployAll(msg.sender); // Fee recipient
        
        vm.stopBroadcast();
    }
}