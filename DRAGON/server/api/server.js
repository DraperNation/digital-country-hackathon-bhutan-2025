const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config({ path: "../.env", silent: true });

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Contract configuration
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.DRAGON_COIN_ADDRESS;

// Create provider and contract instance
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractABI = [
  "function bitcoinReserves() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function collateralRatio() view returns (uint256)",
  "function exchangeRate() view returns (uint256)",
  "function getMaxMintableAmount() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function updateReserves(uint256 newReserves) external",
  "function updateCollateralRatio(uint256 newRatio) external",
  "function updateExchangeRate(uint256 newRate) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event ReservesUpdated(uint256 newReserves)",
  "event CollateralRatioUpdated(uint256 newRatio)",
  "event ExchangeRateUpdated(uint256 newRate)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// API Routes

// Get contract status - BTC reserves, DGC circulation, reserve ratio
app.get('/api/status', async (req, res) => {
  try {
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
    const collateralRatioPercent = parseFloat(collateralRatio) / 100;
    const btcPriceUSD = (parseFloat(exchangeRate) * 100000000) / 100;
    
    const reserveValueUSD = parseFloat((btcReservesBTC * btcPriceUSD).toFixed(2));
    const dgcValueUSD = parseFloat((dgcCirculation * 1.0).toFixed(2));
    const actualReserveRatio = dgcCirculation > 0 ? parseFloat(((reserveValueUSD / dgcValueUSD) * 100).toFixed(2)) : 0;

    const result = {
      btc_reserves: {
        satoshis: bitcoinReserves.toString(),
        btc: btcReservesBTC,
        usd_value: reserveValueUSD
      },
      dgc_circulation: {
        wei: totalSupply.toString(),
        dgc: dgcCirculation,
        usd_value: dgcValueUSD
      },
      reserve_ratio: {
        target_percent: collateralRatioPercent,
        actual_percent: actualReserveRatio,
        is_overcollateralized: actualReserveRatio >= collateralRatioPercent
      },
      rates: {
        btc_usd: parseFloat(btcPriceUSD.toFixed(2)),
        dgc_target_usd: 1.0,
        exchange_rate_cents_per_satoshi: parseFloat(exchangeRate)
      },
      supply_info: {
        current_supply_dgc: parseFloat(dgcCirculation.toFixed(6)),
        max_mintable_dgc: parseFloat(parseFloat(ethers.utils.formatEther(maxMintableAmount)).toFixed(6)),
        remaining_mintable_dgc: parseFloat(parseFloat(ethers.utils.formatEther(currentMintableAmount)).toFixed(6))
      },
      timestamp: new Date().toISOString(),
      block_number: await provider.getBlockNumber()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get balance for an address
app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await contract.balanceOf(address);
    const balanceDGC = parseFloat(ethers.utils.formatEther(balance));

    const result = {
      address: address,
      balance: {
        wei: balance.toString(),
        dgc: balanceDGC,
        usd_value: balanceDGC * 1.0
      },
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint tokens
app.post('/api/mint', async (req, res) => {
  try {
    const { toAddress, amount } = req.body;
    const amountWei = ethers.utils.parseEther(amount.toString());

    const tx = await contract.mint(toAddress, amountWei);
    const receipt = await tx.wait();

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

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer tokens
app.post('/api/transfer', async (req, res) => {
  try {
    const { toAddress, amount } = req.body;
    const amountWei = ethers.utils.parseEther(amount.toString());

    const tx = await contract.transfer(toAddress, amountWei);
    const receipt = await tx.wait();

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

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reserves
app.post('/api/update-reserves', async (req, res) => {
  try {
    const { reserves } = req.body;
    const tx = await contract.updateReserves(reserves);
    const receipt = await tx.wait();

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

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update collateral ratio
app.post('/api/update-collateral-ratio', async (req, res) => {
  try {
    const { ratio } = req.body;
    const tx = await contract.updateCollateralRatio(ratio);
    const receipt = await tx.wait();

    const result = {
      success: receipt.status === 1,
      transaction_hash: receipt.transactionHash,
      block_number: receipt.blockNumber,
      details: {
        new_ratio_basis_points: ratio,
        new_ratio_percent: ratio / 100
      },
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exchange rate
app.post('/api/update-exchange-rate', async (req, res) => {
  try {
    const { rate } = req.body;
    const tx = await contract.updateExchangeRate(rate);
    const receipt = await tx.wait();

    const btcPriceUSD = (rate * 100000000) / 100;

    const result = {
      success: receipt.status === 1,
      transaction_hash: receipt.transactionHash,
      block_number: receipt.blockNumber,
      details: {
        new_rate_cents_per_satoshi: rate,
        btc_price_usd: btcPriceUSD
      },
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction events
app.get('/api/transactions', async (req, res) => {
  try {
    const { fromBlock = 0, toBlock = 'latest', limit = 100 } = req.query;

    const transferEvents = await contract.queryFilter(contract.filters.Transfer(), fromBlock, toBlock);
    const reserveEvents = await contract.queryFilter(contract.filters.ReservesUpdated(), fromBlock, toBlock);
    const ratioEvents = await contract.queryFilter(contract.filters.CollateralRatioUpdated(), fromBlock, toBlock);
    const rateEvents = await contract.queryFilter(contract.filters.ExchangeRateUpdated(), fromBlock, toBlock);

    const allEvents = [...transferEvents, ...reserveEvents, ...ratioEvents, ...rateEvents]
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, parseInt(limit));

    const formattedEvents = allEvents.map(event => {
      const baseEvent = {
        event_type: event.event,
        transaction_hash: event.transactionHash,
        block_number: event.blockNumber,
        timestamp: new Date().toISOString()
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
        default:
          return baseEvent;
      }
    });

    const result = {
      events: formattedEvents,
      total_events: formattedEvents.length,
      from_block: fromBlock,
      to_block: toBlock,
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ALL transaction events from contract deployment
app.get('/api/all-transactions', async (req, res) => {
  try {
    const { limit = 10000 } = req.query;

    const transferEvents = await contract.queryFilter(contract.filters.Transfer(), 0, 'latest');
    const reserveEvents = await contract.queryFilter(contract.filters.ReservesUpdated(), 0, 'latest');
    const ratioEvents = await contract.queryFilter(contract.filters.CollateralRatioUpdated(), 0, 'latest');
    const rateEvents = await contract.queryFilter(contract.filters.ExchangeRateUpdated(), 0, 'latest');

    // Try to get additional events
    let approvalEvents = [];
    try {
      approvalEvents = await contract.queryFilter(contract.filters.Approval?.(), 0, 'latest');
    } catch (e) {
      // Approval events might not exist
    }

    const allEvents = [...transferEvents, ...reserveEvents, ...ratioEvents, ...rateEvents, ...approvalEvents]
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, parseInt(limit));

    // Get block timestamps for accurate timing
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

    const formattedEvents = allEvents.map(event => {
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
        default:
          return baseEvent;
      }
    });

    const result = {
      contract_address: CONTRACT_ADDRESS,
      total_events_found: transferEvents.length + reserveEvents.length + ratioEvents.length + rateEvents.length + approvalEvents.length,
      events_shown: formattedEvents.length,
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

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    contract_address: CONTRACT_ADDRESS
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DragonCoin API Server',
    version: '1.0.0',
    endpoints: {
      'GET /api/status': 'Get contract status (BTC reserves, DGC circulation, reserve ratio)',
      'GET /api/balance/:address': 'Get token balance for address',
      'POST /api/mint': 'Mint tokens (body: {toAddress, amount})',
      'POST /api/transfer': 'Transfer tokens (body: {toAddress, amount})',
      'POST /api/update-reserves': 'Update BTC reserves (body: {reserves})',
      'POST /api/update-collateral-ratio': 'Update collateral ratio (body: {ratio})',
      'POST /api/update-exchange-rate': 'Update exchange rate (body: {rate})',
      'GET /api/transactions': 'Get transaction events (query: fromBlock, toBlock, limit)',
      'GET /api/all-transactions': 'Get ALL transaction events from contract deployment (query: limit)',
      'GET /api/all-transactions': 'Get ALL transaction events from contract deployment',
      'GET /api/health': 'Health check'
    }
  });
});

app.listen(port, () => {
  console.log(`DragonCoin API Server running at http://localhost:${port}`);
  console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`Network: Sepolia`);
});
