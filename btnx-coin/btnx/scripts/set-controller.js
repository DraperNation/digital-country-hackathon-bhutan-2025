const hre = require("hardhat");

const BTNX_ADDRESS = "0x6f2548B040278E3B65C0158BfD38371e7e9c6712";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const btnx = await hre.ethers.getContractAt("BTNX", BTNX_ADDRESS);

  const tx = await btnx.setController(signer.address);
  await tx.wait();

  console.log(`Controller set to ${signer.address}`);
}

main().catch((err) => {
  console.error("Failed to set controller:", err);
  process.exit(1);
});

