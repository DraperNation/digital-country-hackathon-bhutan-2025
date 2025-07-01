// Script to update Bitcoin reserves
const { ethers } = require("ethers");
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });

async function main() {
  try {
    // Get reserves from arguments
    const reserves = process.argv[2];
    
    if (!reserves) {
      console.error(JSON.stringify({ error: "Missing reserves argument (in satoshis)" }));
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
      "function updateReserves(uint256 newReserves) external"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Update reserves
    const tx = await contract.updateReserves(reserves);
    const receipt = await tx.wait();

    // Format response
    const result = {
      success: receipt.status === 1,
      transaction_hash: receipt.transactionHash,
      block_number: receipt.blockNumber,
      details: {
        new_reserves_satoshis: reserves,
        new_reserves_btc: parseFloat(reserves) / 100000000
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
