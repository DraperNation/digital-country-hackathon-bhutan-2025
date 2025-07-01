// Script to mint tokens
const { ethers } = require("ethers");
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });

async function main() {
  try {
    // Get arguments
    const toAddress = process.argv[2];
    const amount = process.argv[3];
    
    if (!toAddress || !amount) {
      console.error(JSON.stringify({ error: "Missing arguments: address and amount" }));
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
      "function mint(address to, uint256 amount) external"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Convert amount to wei
    const amountWei = ethers.utils.parseEther(amount);

    // Mint tokens
    const tx = await contract.mint(toAddress, amountWei);
    const receipt = await tx.wait();

    // Format response
    const result = {
      success: receipt.status === 1,
      transaction_hash: receipt.transactionHash,
      block_number: receipt.blockNumber,
      details: {
        to: toAddress,
        amount_dgc: amount,
        amount_wei: amountWei.toString()
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
