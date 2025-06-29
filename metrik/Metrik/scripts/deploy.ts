import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { LendingPool } from "../typechain-types";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy METRIK Token
  const MetrikToken = await ethers.getContractFactory("MockERC20");
  const metrikToken = await MetrikToken.deploy("METRIK Token", "METRIK", 18);
  await metrikToken.waitForDeployment();
  console.log("METRIK Token deployed to:", await metrikToken.getAddress());

  // Deploy USDC Mock
  const USDC = await ethers.getContractFactory("MockERC20");
  const usdc = await USDC.deploy("USD Coin", "USDC", 6);
  await usdc.waitForDeployment();
  console.log("USDC Mock deployed to:", await usdc.getAddress());

  // Deploy InvoiceNFT
  const InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
  const invoiceNFT = await InvoiceNFT.deploy();
  await invoiceNFT.waitForDeployment();
  console.log("InvoiceNFT deployed to:", await invoiceNFT.getAddress());

  // Deploy Staking
  const staking = await ethers.deployContract("Staking", [await metrikToken.getAddress()]);
  await staking.waitForDeployment();
  console.log("Staking deployed to:", await staking.getAddress());

  // Deploy LendingPool
  const lendingPool = await ethers.deployContract("LendingPool", [
    await metrikToken.getAddress(),
    await usdc.getAddress(),
    await invoiceNFT.getAddress(),
    await staking.getAddress()
  ]);
  await lendingPool.waitForDeployment();
  console.log("LendingPool deployed to:", await lendingPool.getAddress());

  // Deploy BorrowRegistry
  const borrowRegistry = await ethers.deployContract("BorrowRegistry");
  await borrowRegistry.waitForDeployment();
  console.log("BorrowRegistry deployed to:", await borrowRegistry.getAddress());

  // Set the LendingPool address in BorrowRegistry
  const setLPTx = await borrowRegistry.setLendingPool(await lendingPool.getAddress());
  await setLPTx.wait();
  console.log("Set LendingPool in BorrowRegistry");
  
  // Set the BorrowRegistry address in LendingPool
  const setBRTx = await lendingPool.setBorrowRegistry(await borrowRegistry.getAddress());
  await setBRTx.wait();
  console.log("Set BorrowRegistry in LendingPool");

  // Transfer ownership of Staking to LendingPool
  console.log("Transferring ownership of Staking to LendingPool...");
  const transferOwnershipTx = await staking.transferOwnership(await lendingPool.getAddress());
  await transferOwnershipTx.wait();
  console.log("Ownership transferred successfully");

  // Helper function to grant role with retry
  async function grantRoleWithRetry(contract: any, role: string, account: string, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const tx = await contract.grantRole(role, account);
        await tx.wait();
        console.log(`Granted ${role} to ${account}`);
        return;
      } catch (error: any) {
        if (error.message.includes("replacement transaction underpriced")) {
          console.log(`Retry ${retries + 1}/${maxRetries}: Waiting for previous transaction...`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          retries++;
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to grant role after ${maxRetries} retries`);
  }

  // Grant roles with retry mechanism
  const VERIFIER_ROLE = await invoiceNFT.VERIFIER_ROLE();
  const MINTER_ROLE = await invoiceNFT.MINTER_ROLE();

  await grantRoleWithRetry(invoiceNFT, VERIFIER_ROLE, await lendingPool.getAddress());
  await grantRoleWithRetry(invoiceNFT, MINTER_ROLE, deployer.address);

  // Save deployment addresses
  const network = process.env.HARDHAT_NETWORK || "hardhat";
  const deploymentPath = path.join(__dirname, "..", "deployments", `${network}.json`);
  
  const deployment = {
    metrikToken: await metrikToken.getAddress(),
    usdc: await usdc.getAddress(),
    invoiceNFT: await invoiceNFT.getAddress(),
    staking: await staking.getAddress(),
    lendingPool: await lendingPool.getAddress(),
    borrowRegistry: await borrowRegistry.getAddress()
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log("Deployment addresses saved to:", deploymentPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 