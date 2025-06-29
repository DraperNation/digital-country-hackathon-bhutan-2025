const hre = require("hardhat");

async function main() {
  // Get the first signer from the configured accounts
  const [signer] = await hre.ethers.getSigners();
  
  if (!signer) {
    throw new Error("No signer available. Ensure PRIVATE_KEY is set in .env and valid for the Sepolia network.");
  }

  const address = signer.address;
  const balance = await hre.ethers.provider.getBalance(address);

  console.log(`Deploying contract with account: ${address}`);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    throw new Error("Your Sepolia wallet has 0 ETH. Fund it using a faucet like https://www.alchemy.com/faucets/ethereum-sepolia.");
  }

  const BTNX = await hre.ethers.getContractFactory("BTNX", signer);
  const btnx = await BTNX.deploy();

  await btnx.waitForDeployment();
  console.log(`BTNX deployed to: ${await btnx.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
