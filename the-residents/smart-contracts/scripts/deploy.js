const hre = require("hardhat");

async function main() {
  console.log("Deploying eResidencyNFT contract...");
  
  // Deploy the contract
  const EResidencyNFT = await hre.ethers.getContractFactory("EResidencyNFT");
  const eResidencyNFT = await EResidencyNFT.deploy();
  
  // Wait for deployment to complete
  await eResidencyNFT.waitForDeployment();
  
  console.log(`eResidencyNFT deployed to: ${await eResidencyNFT.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
