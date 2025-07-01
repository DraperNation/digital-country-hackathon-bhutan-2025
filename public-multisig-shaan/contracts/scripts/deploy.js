const { ethers } = require("hardhat");

async function main() {
  const [owner1, owner2, owner3] = await ethers.getSigners();

  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(
    [owner1.address, owner2.address, owner3.address],
    2
  );

  await multiSigWallet.waitForDeployment();
  const contractAddress = await multiSigWallet.getAddress();

  console.log("MultiSigWallet deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 