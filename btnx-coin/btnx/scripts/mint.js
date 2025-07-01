const hre = require("hardhat");

const BTNX_ADDRESS = "0x6f2548B040278E3B65C0158BfD38371e7e9c6712";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const btnx = await hre.ethers.getContractAt("BTNX", BTNX_ADDRESS);

  const amount = hre.ethers.parseUnits("1000", 18);
  const tx = await btnx.mint(signer.address, amount);
  await tx.wait();

  console.log(`Minted 1000 BTNX to ${signer.address}`);
}

main().catch((err) => {
  console.error("Mint failed:", err);
  process.exit(1);
});

