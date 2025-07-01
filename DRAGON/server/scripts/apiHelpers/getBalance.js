// Script to get token balance for any address
const { ethers } = require("ethers");
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });

async function main() {
  try {
    // Get address from arguments
    const address = process.argv[2];
    if (!address) {
      console.error(JSON.stringify({ error: "Missing address argument" }));
      process.exit(1);
    }

    // Get environment variables
    const infuraApiKey = process.env.INFURA_API_KEY;
    const contractAddress = process.env.DRAGON_COIN_ADDRESS;
    
    if (!infuraApiKey || !contractAddress) {
      console.error(JSON.stringify({ error: "Missing required environment variables" }));
      process.exit(1);
    }

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);

    // Contract ABI
    const contractABI = [
      "function balanceOf(address account) view returns (uint256)"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Get balance
    const balance = await contract.balanceOf(address);
    const balanceDGC = parseFloat(ethers.utils.formatEther(balance));

    // Format response
    const result = {
      address: address,
      balance: {
        wei: balance.toString(),
        dgc: balanceDGC,
        usd_value: balanceDGC * 1.0 // Assuming 1 DGC = 1 USD
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
