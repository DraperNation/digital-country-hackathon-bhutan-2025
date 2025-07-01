# BBT Token System - Deployment Guide

## Overview
This guide will help you deploy the BBT Token System smart contracts to Avalanche Fuji Testnet and configure the frontend to interact with them.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Avalanche Fuji Testnet** configured in MetaMask
4. **Test AVAX** for gas fees (get from [Avalanche Faucet](https://faucet.avax.network/))

## Step 1: Configure MetaMask for Avalanche Fuji Testnet

1. Open MetaMask
2. Click on the network dropdown
3. Select "Add Network" → "Add Network Manually"
4. Enter the following details:
   - **Network Name**: Avalanche Fuji Testnet
   - **New RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
   - **Chain ID**: 43113
   - **Currency Symbol**: AVAX
   - **Block Explorer URL**: https://testnet.snowtrace.io

## Step 2: Get Test AVAX

1. Visit [Avalanche Faucet](https://faucet.avax.network/)
2. Connect your MetaMask wallet
3. Request test AVAX (you'll receive 2 AVAX)

## Step 3: Deploy Smart Contracts

### Install Dependencies
```bash
npm install
```

### Configure Hardhat
The `hardhat.config.js` is already configured for Avalanche Fuji Testnet.

### Deploy Contracts
```bash
# Deploy BBT Token contract
npx hardhat run scripts/deploy.js --network fuji
```

### Save Contract Addresses
After deployment, you'll see output like:
```
BBT Token deployed to: 0x...
BBT Faucet deployed to: 0x...
```

## Step 4: Configure Frontend

### Create Environment File
Create a `.env` file in the project root:

```env
# Contract Addresses (replace with your deployed addresses)
VITE_BBT_TOKEN_ADDRESS=0xYOUR_BBT_TOKEN_ADDRESS
VITE_BBT_FAUCET_ADDRESS=0xYOUR_BBT_FAUCET_ADDRESS
VITE_RESERVE_TOKEN_ADDRESS=0xd00ae08403B9bbb9124bB305C09058E32C39A48c

# Network Configuration
VITE_NETWORK_CHAIN_ID=0xa869
VITE_NETWORK_NAME=Avalanche Fuji Testnet
VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_EXPLORER_URL=https://testnet.snowtrace.io
```

### Update Contract Addresses
Replace the placeholder addresses in `.env` with your actual deployed contract addresses.

## Step 5: Start Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Step 6: Test the System

### 1. Connect Wallet
- Click "Connect MetaMask" in the frontend
- Approve the connection in MetaMask
- Ensure you're on Avalanche Fuji Testnet

### 2. Get Test Tokens
- Click "Request Faucet Tokens" to get initial BBT tokens
- Wait for transaction confirmation

### 3. Mint BBT
- Enter amount of BBT to mint
- Click "Mint BBT"
- Approve transaction in MetaMask
- Wait for confirmation

### 4. Burn BBT
- Enter amount of BBT to burn
- Click "Burn BBT"
- Approve transaction in MetaMask
- Wait for confirmation

### 5. View Transaction History
- All transactions will appear in the Transaction History section
- Click "View" to see transaction on Snowtrace
- Click "Copy" to copy transaction hash

## Contract Functions

### BBT Token Contract
- `mint(uint256 amount)` - Mint BBT tokens with WAVAX
- `burn(uint256 amount)` - Burn BBT tokens for WAVAX
- `balanceOf(address account)` - Get BBT balance
- `totalSupply()` - Get total BBT supply
- `getReserveBalance()` - Get WAVAX reserves
- `getCollateralizationRatio()` - Get collateralization ratio

### BBT Faucet Contract
- `requestTokens()` - Request free BBT tokens
- `canRequest(address user)` - Check if user can request
- `getNextDripTime(address user)` - Get next available request time
- `dripAmount()` - Get amount of tokens per request

## Troubleshooting

### Common Issues

1. **"Insufficient funds"**
   - Get more test AVAX from the faucet

2. **"Transaction failed"**
   - Check if you have enough BBT for burning
   - Ensure you're on the correct network

3. **"Contract not found"**
   - Verify contract addresses in `.env`
   - Ensure contracts are deployed to Fuji testnet

4. **"Network error"**
   - Switch to Avalanche Fuji Testnet in MetaMask
   - Check RPC URL configuration

### Gas Fees
- Fuji testnet gas fees are very low (usually < 0.01 AVAX)
- If transactions fail, try increasing gas limit in MetaMask

## Production Deployment

For production deployment on Avalanche Mainnet:

1. Update `hardhat.config.js` to use mainnet RPC
2. Deploy contracts to mainnet
3. Update environment variables with mainnet addresses
4. Use real AVAX for gas fees

## Security Notes

- Never share your private keys
- Always verify contract addresses
- Test thoroughly on testnet before mainnet
- Keep your MetaMask secure

## Support

For issues or questions:
1. Check the transaction history for error details
2. Verify network configuration
3. Ensure sufficient funds for gas fees
4. Check contract deployment status on Snowtrace 