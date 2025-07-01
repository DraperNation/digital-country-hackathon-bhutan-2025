// Script to update collateral ratio
const { ethers } = require("ethers");
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });

async function main() {
  try {
    // Get ratio from arguments
    const ratio = process.argv[2];
    
    if (!ratio) {
      console.error(JSON.stringify({ error: "Missing ratio argument (in basis points)" }));
      process.exit(1);
    }

    // Get environment variables
    const infuraApiKey = process.env.INFURA_API_KEY;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.DRAGON_COIN_ADDRESS;
    
    if (!infuraApiKey || !privateKey || !contractAddress) {
      console.error(JSON.stringify({ error: "Missing required environment variables" }));
      process.exit(1);
    }

    // Create provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Contract ABI
    const contractABI = [
      "function updateCollateralRatio(uint256 newRatio) external"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Update collateral ratio
    const tx = await contract.updateCollateralRatio(parseInt(ratio));
    const receipt = await tx.wait();

    // Format response
    const result = {
      success: receipt.status === 1,
      transaction_hash: receipt.transactionHash,
      block_number: receipt.blockNumber,
      details: {
        new_ratio_basis_points: parseInt(ratio),
        new_ratio_percent: parseInt(ratio) / 100
      },
      timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
