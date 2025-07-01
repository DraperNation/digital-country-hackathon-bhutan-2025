// Script to update exchange rate
const { ethers } = require("ethers");
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });

async function main() {
  try {
    // Get rate from arguments
    const rate = process.argv[2];
    
    if (!rate) {
      console.error(JSON.stringify({ error: "Missing rate argument (USD cents per satoshi)" }));
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
      "function updateExchangeRate(uint256 newRate) external"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Update exchange rate
    const tx = await contract.updateExchangeRate(parseInt(rate));
    const receipt = await tx.wait();

    // Calculate BTC price
    const btcPriceUSD = (parseInt(rate) * 100000000) / 100;

    // Format response
    const result = {
      success: receipt.status === 1,
      transaction_hash: receipt.transactionHash,
      block_number: receipt.blockNumber,
      details: {
        new_rate_cents_per_satoshi: parseInt(rate),
        btc_price_usd: btcPriceUSD
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
