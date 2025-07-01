// Script to get contract status - BTC reserves, DGC circulation, reserve ratio
const { ethers } = require("ethers");

// Suppress all dotenv output completely
process.env.DOTENV_CONFIG_SILENT = 'true';
process.env.DOTENV_CONFIG_DEBUG = 'false';
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Temporarily capture dotenv output
console.log = () => {};
console.error = () => {};
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });
console.log = originalConsoleLog;
console.error = originalConsoleError;

async function main() {
  try {
    // Get environment variables
    const infuraApiKey = process.env.INFURA_API_KEY;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.DRAGON_COIN_ADDRESS;
    
    if (!infuraApiKey || !privateKey || !contractAddress) {
      console.error(JSON.stringify({ error: "Missing required environment variables" }));
      process.exit(1);
    }

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);

    // Contract ABI - only functions that actually exist and work
    const contractABI = [
      "function bitcoinReserves() view returns (uint256)",
      "function totalSupply() view returns (uint256)",
      "function collateralRatio() view returns (uint256)",
      "function exchangeRate() view returns (uint256)",
      "function getMaxMintableAmount() view returns (uint256)"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Get contract data
    const bitcoinReserves = await contract.bitcoinReserves();
    const totalSupply = await contract.totalSupply();
    const collateralRatio = await contract.collateralRatio();
    const exchangeRate = await contract.exchangeRate();
    const maxMintableAmount = await contract.getMaxMintableAmount();
    
    // Calculate current mintable amount manually
    const currentMintableAmount = maxMintableAmount.gt(totalSupply) ? maxMintableAmount.sub(totalSupply) : ethers.BigNumber.from(0);

    // Calculate values
    const btcReservesBTC = parseFloat(ethers.utils.formatUnits(bitcoinReserves, 8));
    const dgcCirculation = parseFloat(ethers.utils.formatEther(totalSupply));
    const collateralRatioPercent = parseFloat(collateralRatio) / 100; // basis points to percent
    const btcPriceUSD = (parseFloat(exchangeRate) * 100000000) / 100; // cents per satoshi to USD per BTC
    
    // Calculate reserve values with proper number handling
    const reserveValueUSD = parseFloat((btcReservesBTC * btcPriceUSD).toFixed(2));
    const dgcValueUSD = parseFloat((dgcCirculation * 1.0).toFixed(2)); // Assuming 1 DGC = 1 USD target
    const actualReserveRatio = dgcCirculation > 0 ? parseFloat(((reserveValueUSD / dgcValueUSD) * 100).toFixed(2)) : 0;

    // Format response
    const result = {
      // BTC in reserve
      btc_reserves: {
        satoshis: bitcoinReserves.toString(),
        btc: btcReservesBTC,
        usd_value: reserveValueUSD
      },
      
      // DGC in circulation
      dgc_circulation: {
        wei: totalSupply.toString(),
        dgc: dgcCirculation,
        usd_value: dgcValueUSD
      },
      
      // Reserve ratio
      reserve_ratio: {
        target_percent: collateralRatioPercent,
        actual_percent: actualReserveRatio,
        is_overcollateralized: actualReserveRatio >= collateralRatioPercent
      },
      
      // Exchange rates
      rates: {
        btc_usd: parseFloat(btcPriceUSD.toFixed(2)),
        dgc_target_usd: 1.0,
        exchange_rate_cents_per_satoshi: parseFloat(exchangeRate)
      },
      
      // Supply info
      supply_info: {
        current_supply_dgc: parseFloat(dgcCirculation.toFixed(6)),
        max_mintable_dgc: parseFloat(parseFloat(ethers.utils.formatEther(maxMintableAmount)).toFixed(6)),
        remaining_mintable_dgc: parseFloat(parseFloat(ethers.utils.formatEther(currentMintableAmount)).toFixed(6))
      },
      
      // Timestamp for historical data
      timestamp: new Date().toISOString(),
      block_number: await provider.getBlockNumber()
    };

    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
