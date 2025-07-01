const { ethers } = require("hardhat");

async function main() {
  console.log("Starting BBT Token deployment on Avalanche Fuji...");
  
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.getBalance()).toString()}`);

  // Fuji testnet WAVAX address
  const FUJI_WAVAX = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
  
  // Configuration
  const CONFIG = {
    token: {
      name: "Bhutan Bitcoin Token",
      symbol: "BBT",
      decimals: 8,
      initialSupply: ethers.utils.parseUnits("1000000", 8) // 1M BBT
    },
    faucet: {
      dripAmount: ethers.utils.parseUnits("100", 8), // 100 BBT
      cooldown: 24 * 60 * 60 // 24 hours
    }
  };

  try {
    // 1. Deploy BBT Token
    console.log("\n1. Deploying BBT Token...");
    const BBTToken = await ethers.getContractFactory("BBTToken");
    const bbtToken = await BBTToken.deploy(
      CONFIG.token.name,
      CONFIG.token.symbol,
      CONFIG.token.decimals,
      FUJI_WAVAX, // Reserve token (WAVAX for testnet)
      deployer.address // Oracle (deployer for now)
    );
    await bbtToken.deployed();
    console.log(`BBT Token deployed to: ${bbtToken.address}`);

    // 2. Deploy Faucet
    console.log("\n2. Deploying Faucet...");
    const BBTFaucet = await ethers.getContractFactory("BBTFaucet");
    const faucet = await BBTFaucet.deploy(bbtToken.address);
    await faucet.deployed();
    console.log(`Faucet deployed to: ${faucet.address}`);

    // 3. Configure faucet
    console.log("\n3. Configuring faucet...");
    await faucet.setDripAmount(CONFIG.faucet.dripAmount);
    await faucet.setCooldown(CONFIG.faucet.cooldown);
    console.log("Faucet configured");

    // 4. Fund faucet
    console.log("\n4. Funding faucet...");
    const faucetAmount = ethers.utils.parseUnits("50000", 8); // 50k BBT
    await bbtToken.transfer(faucet.address, faucetAmount);
    console.log(`Faucet funded with ${ethers.utils.formatUnits(faucetAmount, 8)} BBT`);

    // 5. Set initial parameters
    console.log("\n5. Setting initial parameters...");
    await bbtToken.setFees(10, 10); // 0.1% mint and burn fees
    await bbtToken.setCollateralRatios(15000, 20000, 30000); // 150%, 200%, 300%
    console.log("Initial parameters set");

    console.log("\n✅ Deployment complete!");
    console.log("\nContract addresses:");
    console.log(`BBT Token: ${bbtToken.address}`);
    console.log(`Faucet: ${faucet.address}`);
    console.log(`Reserve Token (WAVAX): ${FUJI_WAVAX}`);
    
    console.log("\nNext steps:");
    console.log("1. Verify contracts on Snowtrace");
    console.log("2. Test faucet functionality");
    console.log("3. Test mint/burn operations");
    
    // Save deployment info
    const deploymentInfo = {
      network: "Avalanche Fuji Testnet",
      deployer: deployer.address,
      contracts: {
        bbtToken: bbtToken.address,
        faucet: faucet.address,
        reserveToken: FUJI_WAVAX
      },
      config: CONFIG,
      timestamp: new Date().toISOString()
    };
    
    console.log("\nDeployment info:", JSON.stringify(deploymentInfo, null, 2));

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 