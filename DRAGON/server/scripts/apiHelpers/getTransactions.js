// Script to get ALL transaction events from the DragonCoin contract
const { ethers } = require("ethers");
require("dotenv").config({ path: "D:\\dragon coin\\dragon-coin-sepolia\\.env", silent: true });

async function main() {
  try {
    // Get ALL transactions from the beginning of the contract
    const fromBlock = 0; // Always start from block 0
    const toBlock = "latest"; // Always go to latest block
    const limit = parseInt(process.argv[2]) || 10000; // Optional limit as first argument

    // Get environment variables
    const infuraApiKey = process.env.INFURA_API_KEY;
    const contractAddress = process.env.DRAGON_COIN_ADDRESS;
    
    if (!infuraApiKey || !contractAddress) {
      console.error(JSON.stringify({ error: "Missing required environment variables" }));
      process.exit(1);
    }

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);

    // Contract ABI for all events including admin events
    const contractABI = [
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event ReservesUpdated(uint256 newReserves)",
      "event CollateralRatioUpdated(uint256 newRatio)",
      "event ExchangeRateUpdated(uint256 newRate)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)",
      "event Paused(address account)",
      "event Unpaused(address account)",
      "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
      "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
      "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Get ALL events from the contract (from deployment to now)
    console.log("Fetching ALL transaction events from contract deployment...");
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Searching from block 0 to latest...`);
    
    const transferEvents = await contract.queryFilter(contract.filters.Transfer(), fromBlock, toBlock);
    const reserveEvents = await contract.queryFilter(contract.filters.ReservesUpdated(), fromBlock, toBlock);
    const ratioEvents = await contract.queryFilter(contract.filters.CollateralRatioUpdated(), fromBlock, toBlock);
    const rateEvents = await contract.queryFilter(contract.filters.ExchangeRateUpdated(), fromBlock, toBlock);
    
    console.log(`Found ${transferEvents.length} Transfer events`);
    console.log(`Found ${reserveEvents.length} ReservesUpdated events`);
    console.log(`Found ${ratioEvents.length} CollateralRatioUpdated events`);
    console.log(`Found ${rateEvents.length} ExchangeRateUpdated events`);
    
    // Try to get additional events (may not exist in all contracts)
    let approvalEvents = [];
    let pausedEvents = [];
    let unpausedEvents = [];
    let roleEvents = [];
    
    try {
      approvalEvents = await contract.queryFilter(contract.filters.Approval(), fromBlock, toBlock);
      pausedEvents = await contract.queryFilter(contract.filters.Paused(), fromBlock, toBlock);
      unpausedEvents = await contract.queryFilter(contract.filters.Unpaused(), fromBlock, toBlock);
      
      const roleGrantedEvents = await contract.queryFilter(contract.filters.RoleGranted(), fromBlock, toBlock);
      const roleRevokedEvents = await contract.queryFilter(contract.filters.RoleRevoked(), fromBlock, toBlock);
      const roleAdminEvents = await contract.queryFilter(contract.filters.RoleAdminChanged(), fromBlock, toBlock);
      roleEvents = [...roleGrantedEvents, ...roleRevokedEvents, ...roleAdminEvents];
      
      console.log(`Found ${approvalEvents.length} Approval events`);
      console.log(`Found ${pausedEvents.length} Paused events`);
      console.log(`Found ${unpausedEvents.length} Unpaused events`);
      console.log(`Found ${roleEvents.length} Role-related events`);
    } catch (e) {
      console.log("Some additional events not available in this contract");
    }

    // Combine and sort ALL events by block number (newest first)
    const allEvents = [
      ...transferEvents, 
      ...reserveEvents, 
      ...ratioEvents, 
      ...rateEvents,
      ...approvalEvents,
      ...pausedEvents,
      ...unpausedEvents,
      ...roleEvents
    ]
      .sort((a, b) => b.blockNumber - a.blockNumber);

    const totalEvents = allEvents.length;
    const eventsToShow = allEvents.slice(0, limit);

    console.log(`\nTotal events found: ${totalEvents}`);
    console.log(`Showing: ${eventsToShow.length} events (limited by: ${limit})`);
    console.log("Getting block timestamps for accurate event timing...\n");
    // Get block timestamps for accurate timing
    const blockTimestamps = {};
    const uniqueBlocks = [...new Set(eventsToShow.map(event => event.blockNumber))];
    
    for (const blockNumber of uniqueBlocks) {
      try {
        const block = await provider.getBlock(blockNumber);
        blockTimestamps[blockNumber] = new Date(block.timestamp * 1000).toISOString();
      } catch (e) {
        blockTimestamps[blockNumber] = new Date().toISOString();
      }
    }

    // Format events with accurate timestamps
    const formattedEvents = eventsToShow.map(event => {
      const baseEvent = {
        event_type: event.event,
        transaction_hash: event.transactionHash,
        block_number: event.blockNumber,
        timestamp: blockTimestamps[event.blockNumber] || new Date().toISOString(),
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
        case 'Paused':
          return {
            ...baseEvent,
            details: {
              paused_by: event.args.account
            }
          };
        case 'Unpaused':
          return {
            ...baseEvent,
            details: {
              unpaused_by: event.args.account
            }
          };
        case 'RoleGranted':
          return {
            ...baseEvent,
            details: {
              role: event.args.role,
              account: event.args.account,
              sender: event.args.sender
            }
          };
        case 'RoleRevoked':
          return {
            ...baseEvent,
            details: {
              role: event.args.role,
              account: event.args.account,
              sender: event.args.sender
            }
          };
        case 'RoleAdminChanged':
          return {
            ...baseEvent,
            details: {
              role: event.args.role,
              previous_admin_role: event.args.previousAdminRole,
              new_admin_role: event.args.newAdminRole
            }
          };
        default:
          return baseEvent;
      }
    });

    // Format response with comprehensive statistics
    const result = {
      summary: {
        total_events_found: totalEvents,
        events_shown: formattedEvents.length,
        contract_address: contractAddress,
        search_range: `Block 0 to latest`,
        event_breakdown: {
          transfers: transferEvents.length,
          reserves_updates: reserveEvents.length,
          collateral_ratio_updates: ratioEvents.length,
          exchange_rate_updates: rateEvents.length,
          approvals: approvalEvents.length,
          pause_events: pausedEvents.length + unpausedEvents.length,
          role_events: roleEvents.length
        }
      },
      events: formattedEvents,
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
