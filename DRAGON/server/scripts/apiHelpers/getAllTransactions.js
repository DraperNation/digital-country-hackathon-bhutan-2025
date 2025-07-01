// Script to get ALL transactions from DragonCoin contract (clean output)
const { ethers } = require("ethers");
// Suppress dotenv output completely
const originalWrite = process.stderr.write;
process.stderr.write = function() {};

require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env" });

// Restore stderr after dotenv loads
process.stderr.write = originalWrite;

async function main() {
  try {
    const limit = parseInt(process.argv[2]) || 10000;

    // Get environment variables
    const infuraApiKey = process.env.INFURA_API_KEY;
    const contractAddress = process.env.DRAGON_COIN_ADDRESS;
    
    if (!infuraApiKey || !contractAddress) {
      console.error(JSON.stringify({ error: "Missing required environment variables" }));
      process.exit(1);
    }

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);

    // Contract ABI for all events
    const contractABI = [
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event ReservesUpdated(uint256 newReserves)",
      "event CollateralRatioUpdated(uint256 newRatio)",
      "event ExchangeRateUpdated(uint256 newRate)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Get ALL events from contract deployment
    const transferEvents = await contract.queryFilter(contract.filters.Transfer(), 0, "latest");
    const reserveEvents = await contract.queryFilter(contract.filters.ReservesUpdated(), 0, "latest");
    const ratioEvents = await contract.queryFilter(contract.filters.CollateralRatioUpdated(), 0, "latest");
    const rateEvents = await contract.queryFilter(contract.filters.ExchangeRateUpdated(), 0, "latest");
    
    let approvalEvents = [];
    try {
      approvalEvents = await contract.queryFilter(contract.filters.Approval(), 0, "latest");
    } catch (e) {
      // Approval events might not exist
    }

    // Combine and sort all events
    const allEvents = [
      ...transferEvents, 
      ...reserveEvents, 
      ...ratioEvents, 
      ...rateEvents,
      ...approvalEvents
    ]
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, limit);

    // Get block timestamps
    const blockTimestamps = {};
    const uniqueBlocks = [...new Set(allEvents.map(event => event.blockNumber))];
    
    for (const blockNumber of uniqueBlocks) {
      try {
        const block = await provider.getBlock(blockNumber);
        blockTimestamps[blockNumber] = new Date(block.timestamp * 1000).toISOString();
      } catch (e) {
        blockTimestamps[blockNumber] = new Date().toISOString();
      }
    }

    // Format events
    const formattedEvents = allEvents.map(event => {
      const baseEvent = {
        event_type: event.event,
        transaction_hash: event.transactionHash,
        block_number: event.blockNumber,
        timestamp: blockTimestamps[event.blockNumber],
        log_index: event.logIndex
      };

      switch (event.event) {
        case 'Transfer':
          return {
            ...baseEvent,
            details: {
              from: event.args.from,
              to: event.args.to,
              amount_wei: event.args.value.toString(),
              amount_dgc: parseFloat(ethers.utils.formatEther(event.args.value))
            }
          };
        case 'ReservesUpdated':
          return {
            ...baseEvent,
            details: {
              new_reserves_satoshis: event.args.newReserves.toString(),
              new_reserves_btc: parseFloat(event.args.newReserves) / 100000000
            }
          };
        case 'CollateralRatioUpdated':
          return {
            ...baseEvent,
            details: {
              new_ratio_basis_points: event.args.newRatio.toString(),
              new_ratio_percent: parseFloat(event.args.newRatio) / 100
            }
          };
        case 'ExchangeRateUpdated':
          return {
            ...baseEvent,
            details: {
              new_rate_cents_per_satoshi: event.args.newRate.toString(),
              btc_price_usd: (parseFloat(event.args.newRate) * 100000000) / 100
            }
          };
        case 'Approval':
          return {
            ...baseEvent,
            details: {
              owner: event.args.owner,
              spender: event.args.spender,
              amount_wei: event.args.value.toString(),
              amount_dgc: parseFloat(ethers.utils.formatEther(event.args.value))
            }
          };
        default:
          return baseEvent;
      }
    });

    // Output result
    const result = {
      contract_address: contractAddress,
      total_events: allEvents.length,
      event_breakdown: {
        transfers: transferEvents.length,
        reserves_updates: reserveEvents.length,
        collateral_ratio_updates: ratioEvents.length,
        exchange_rate_updates: rateEvents.length,
        approvals: approvalEvents.length
      },
      events: formattedEvents,
      timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
