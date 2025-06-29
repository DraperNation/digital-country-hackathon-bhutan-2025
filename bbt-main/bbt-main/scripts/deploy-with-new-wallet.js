const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting BBT Token System Deployment...");
  
  // Generate a new wallet for deployment
  const wallet = ethers.Wallet.createRandom();
  console.log("📝 Generated new deployment wallet:");
  console.log("   Address:", wallet.address);
  console.log("   Private Key:", wallet.privateKey);
  
  // Connect to Fuji testnet
  const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
  const deployer = wallet.connect(provider);
  
  console.log("\n💰 Checking wallet balance...");
  const balance = await deployer.getBalance();
  console.log("   Balance:", ethers.formatEther(balance), "AVAX");
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low balance. Please fund the wallet with test AVAX from:");
    console.log("   https://faucet.avax.network/");
    console.log("   Address:", wallet.address);
    return;
  }
  
  console.log("\n📦 Deploying BBT Token contract...");
  
  // Deploy BBT Token
  const BBTToken = await ethers.getContractFactory("BBTToken", deployer);
  const bbtToken = await BBTToken.deploy(
    "Bhutan Bitcoin Token", // name
    "BBT",                  // symbol
    8,                      // decimals (like Bitcoin)
    "0xd00ae08403B9bbb9124bB305C09058E32C39A48c", // WAVAX on Fuji
    "0x0000000000000000000000000000000000000000"  // Mock oracle address
  );
  
  await bbtToken.waitForDeployment();
  const bbtTokenAddress = await bbtToken.getAddress();
  console.log("✅ BBT Token deployed to:", bbtTokenAddress);
  
  console.log("\n🚰 Deploying BBT Faucet contract...");
  
  // Deploy BBT Faucet
  const BBTFaucet = await ethers.getContractFactory("BBTFaucet", deployer);
  const bbtFaucet = await BBTFaucet.deploy(bbtTokenAddress);
  
  await bbtFaucet.waitForDeployment();
  const bbtFaucetAddress = await bbtFaucet.getAddress();
  console.log("✅ BBT Faucet deployed to:", bbtFaucetAddress);
  
  console.log("\n🔧 Setting up faucet permissions...");
  
  // Grant faucet minting permissions
  const mintRole = await bbtToken.MINTER_ROLE();
  await bbtToken.grantRole(mintRole, bbtFaucetAddress);
  console.log("✅ Granted minting role to faucet");
  
  // Set faucet drip amount (100 BBT)
  await bbtFaucet.setDripAmount(ethers.parseUnits("100", 8));
  console.log("✅ Set faucet drip amount to 100 BBT");
  
  // Set faucet cooldown (1 hour)
  await bbtFaucet.setCooldownPeriod(3600);
  console.log("✅ Set faucet cooldown to 1 hour");
  
  console.log("\n📋 Creating .env file...");
  
  // Create .env file content
  const envContent = `# BBT Token System Environment Variables
# Generated on ${new Date().toISOString()}

# Contract Addresses (Avalanche Fuji Testnet)
VITE_BBT_TOKEN_ADDRESS=${bbtTokenAddress}
VITE_BBT_FAUCET_ADDRESS=${bbtFaucetAddress}
VITE_RESERVE_TOKEN_ADDRESS=0xd00ae08403B9bbb9124bB305C09058E32C39A48c

# Network Configuration
VITE_NETWORK_CHAIN_ID=0xa869
VITE_NETWORK_NAME=Avalanche Fuji Testnet
VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_EXPLORER_URL=https://testnet.snowtrace.io

# Deployment Wallet (Keep this secure!)
DEPLOYER_PRIVATE_KEY=${wallet.privateKey}
DEPLOYER_ADDRESS=${wallet.address}

# Optional: Snowtrace API Key for contract verification
SNOWTRACE_API_KEY=

# Optional: Oracle Configuration (for BTC price)
VITE_BTC_PRICE_ORACLE_ADDRESS=0x0000000000000000000000000000000000000000
`;
  
  // Write .env file
  fs.writeFileSync(path.join(process.cwd(), ".env"), envContent);
  console.log("✅ .env file created successfully");
  
  console.log("\n🎉 Deployment Summary:");
  console.log("   BBT Token:", bbtTokenAddress);
  console.log("   BBT Faucet:", bbtFaucetAddress);
  console.log("   Deployer:", wallet.address);
  console.log("   Network: Avalanche Fuji Testnet");
  console.log("   Explorer: https://testnet.snowtrace.io");
  
  console.log("\n🔗 Contract Links:");
  console.log(`   BBT Token: https://testnet.snowtrace.io/address/${bbtTokenAddress}`);
  console.log(`   BBT Faucet: https://testnet.snowtrace.io/address/${bbtFaucetAddress}`);
  
  console.log("\n⚠️  Important:");
  console.log("   1. Fund the deployer wallet with test AVAX for faucet operations");
  console.log("   2. Keep the private key secure");
  console.log("   3. The frontend will automatically use these contract addresses");
  
  console.log("\n🚀 Next Steps:");
  console.log("   1. Start the frontend: npm run dev");
  console.log("   2. Connect MetaMask to Fuji testnet");
  console.log("   3. Test minting and burning BBT tokens");
  console.log("   4. Use the faucet to get test BBT tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 