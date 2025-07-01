# 🚀 BBT Token System - Complete Setup Guide

## 📋 Overview
This guide will walk you through setting up the complete BBT (Bhutan Bitcoin Token) system locally, including smart contract deployment, frontend configuration, and real transaction signing.

## 🎯 What You'll Build
- **BBT Token Contract**: Bitcoin-backed token on Avalanche
- **BBT Faucet**: Testnet token distribution
- **Premium Frontend**: Glassmorphic UI with real-time data
- **Transaction History**: Complete logging and tracking
- **Wallet Integration**: MetaMask with real signing

---

## 📦 Prerequisites

### 1. System Requirements
- **Node.js** (v16 or higher)
- **Git** (for cloning the repository)
- **MetaMask** browser extension
- **Code Editor** (VS Code recommended)

### 2. Install Node.js
```bash
# Download from: https://nodejs.org/
# Or use nvm (Node Version Manager)
nvm install 18
nvm use 18
```

### 3. Install Git
```bash
# Download from: https://git-scm.com/
# Or use package manager
# Windows: winget install Git.Git
# macOS: brew install git
# Linux: sudo apt-get install git
```

---

## 🔧 Step 1: Clone and Setup Repository

### 1.1 Clone the Repository
```bash
git clone https://github.com/ushi86/bbt.git
cd bbt
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Install Additional Dependencies
```bash
npm install --save-dev @openzeppelin/contracts --legacy-peer-deps
```

---

## 🌐 Step 2: Configure MetaMask for Avalanche

### 2.1 Add Avalanche Fuji Testnet
1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add Network Manually"
3. Enter these details:
   ```
   Network Name: Avalanche Fuji Testnet
   New RPC URL: https://api.avax-test.network/ext/bc/C/rpc
   Chain ID: 43113
   Currency Symbol: AVAX
   Block Explorer URL: https://testnet.snowtrace.io
   ```

### 2.2 Get Testnet AVAX
1. Visit [Avalanche Faucet](https://faucet.avax.network/)
2. Connect your MetaMask wallet
3. Request test AVAX (you'll receive 2 AVAX)

---

## 📜 Step 3: Deploy Smart Contracts

### 3.1 Compile Contracts
```bash
npx hardhat compile
```

### 3.2 Run Deployment Script
```bash
node scripts/deploy-simple.cjs
```

**Expected Output:**
```
🚀 Starting BBT Token System Deployment...
📝 Generated new deployment wallet:
   Address: 0x... (your generated address)
   Private Key: 0x... (your private key)

💰 Checking wallet balance...
   Balance: 0 AVAX

⚠️  Warning: Low balance. Please fund the wallet with test AVAX from:
   https://faucet.avax.network/
   Address: 0x... (your generated address)
```

### 3.3 Fund the Deployment Wallet
1. Copy the generated wallet address
2. Go to [Avalanche Faucet](https://faucet.avax.network/)
3. Send at least **0.5 AVAX** to the deployment wallet
4. Wait for confirmation (usually 1-2 minutes)

### 3.4 Complete Deployment
```bash
node scripts/deploy-simple.cjs
```

**Expected Output:**
```
✅ BBT Token deployed to: 0x... (your token address)
✅ BBT Faucet deployed to: 0x... (your faucet address)
✅ .env file created successfully
```

---

## ⚙️ Step 4: Configure Frontend

### 4.1 Verify .env File
The deployment script automatically creates a `.env` file. Verify it contains:
```env
# Contract Addresses (Avalanche Fuji Testnet)
VITE_BBT_TOKEN_ADDRESS=0x... (your deployed token address)
VITE_BBT_FAUCET_ADDRESS=0x... (your deployed faucet address)
VITE_RESERVE_TOKEN_ADDRESS=0xd00ae08403B9bbb9124bB305C09058E32C39A48c

# Network Configuration
VITE_NETWORK_CHAIN_ID=0xa869
VITE_NETWORK_NAME=Avalanche Fuji Testnet
VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_EXPLORER_URL=https://testnet.snowtrace.io

# Deployment Wallet (Keep this secure!)
DEPLOYER_PRIVATE_KEY=0x... (your private key)
DEPLOYER_ADDRESS=0x... (your wallet address)
```

### 4.2 Start Frontend Development Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.4.19  ready in 237 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🔗 Step 5: Connect and Test

### 5.1 Access the Frontend
1. Open your browser
2. Navigate to `http://localhost:5173/`
3. You should see the BBT Protocol dashboard

### 5.2 Connect MetaMask
1. Click "Connect MetaMask" button
2. Approve the connection in MetaMask
3. Ensure you're on Avalanche Fuji Testnet
4. Your wallet address should appear in the header

### 5.3 Get Test Tokens
1. Click "Request Faucet Tokens" button
2. Approve the transaction in MetaMask
3. Wait for confirmation
4. You should receive 100 BBT tokens

### 5.4 Test Minting
1. Enter an amount (e.g., 50 BBT)
2. Click "Mint BBT"
3. Approve the transaction in MetaMask
4. Wait for confirmation
5. Check your BBT balance

### 5.5 Test Burning
1. Enter an amount (e.g., 25 BBT)
2. Click "Burn BBT"
3. Approve the transaction in MetaMask
4. Wait for confirmation
5. Check your WAVAX balance

---

## 📊 Step 6: Monitor and Verify

### 6.1 View Transaction History
- All transactions appear in the "Transaction History" section
- Click "View" to see transaction on Snowtrace
- Click "Copy" to copy transaction hash

### 6.2 Check Contract Status
- Visit your contracts on Snowtrace:
  - BBT Token: `https://testnet.snowtrace.io/address/YOUR_TOKEN_ADDRESS`
  - BBT Faucet: `https://testnet.snowtrace.io/address/YOUR_FAUCET_ADDRESS`

### 6.3 Monitor System Metrics
- Total BBT Supply
- WAVAX Reserves
- Collateralization Ratio
- System Health Status

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "MetaMask Not Detected"
```bash
# Solution: Install MetaMask browser extension
# Download from: https://metamask.io/
```

#### 2. "Wrong Network"
```bash
# Solution: Switch to Avalanche Fuji Testnet in MetaMask
# Chain ID should be 43113
```

#### 3. "Insufficient Funds"
```bash
# Solution: Get more test AVAX from faucet
# Visit: https://faucet.avax.network/
```

#### 4. "Contract Not Found"
```bash
# Solution: Verify contract addresses in .env file
# Ensure contracts are deployed to Fuji testnet
```

#### 5. "Transaction Failed"
```bash
# Solution: Check if you have enough BBT for burning
# Ensure you're on the correct network
# Try increasing gas limit in MetaMask
```

#### 6. "Import Error: ethers"
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 7. "Port Already in Use"
```bash
# Solution: Kill existing processes or use different port
# Windows: netstat -ano | findstr :5173
# macOS/Linux: lsof -ti:5173 | xargs kill -9
```

---

## 🔒 Security Best Practices

### 1. Private Key Security
- Never share your private keys
- Store them securely (password manager or hardware wallet)
- Use different wallets for testing and production

### 2. Network Security
- Always verify you're on the correct network
- Double-check contract addresses
- Use official RPC endpoints

### 3. Transaction Verification
- Always review transaction details before signing
- Verify gas fees and amounts
- Check transaction status on block explorer

---

## 📈 Production Deployment

### 1. Mainnet Preparation
```bash
# Update hardhat.config.cjs for mainnet
# Change RPC URL to mainnet
# Use real AVAX for gas fees
# Deploy contracts to mainnet
```

### 2. Security Audit
- Professional smart contract audit
- Multi-sig treasury implementation
- Oracle integration for real-time prices

### 3. Liquidity Provision
- Add liquidity to DEX (Trader Joe, Pangolin)
- Set up trading pairs (BBT/WAVAX, BBT/USDC)
- Implement yield farming incentives

---

## 🎯 Advanced Features

### 1. Oracle Integration
```solidity
// Replace mock oracle with real price feed
// Chainlink, Pyth, or custom oracle
```

### 2. Multi-sig Treasury
```solidity
// Implement multi-signature wallet for treasury
// Require multiple approvals for large transactions
```

### 3. Governance Token
```solidity
// Add governance functionality
// Allow token holders to vote on protocol changes
```

---

## 📞 Support and Resources

### 1. Documentation
- [Avalanche Documentation](https://docs.avax.network/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)

### 2. Community
- [Avalanche Discord](https://chat.avax.network/)
- [GitHub Issues](https://github.com/ushi86/bbt/issues)

### 3. Tools
- [Snowtrace Explorer](https://testnet.snowtrace.io/)
- [Avalanche Faucet](https://faucet.avax.network/)
- [MetaMask](https://metamask.io/)

---

## ✅ Success Checklist

- [ ] Repository cloned successfully
- [ ] Dependencies installed
- [ ] MetaMask configured for Fuji testnet
- [ ] Test AVAX received
- [ ] Smart contracts deployed
- [ ] .env file created with contract addresses
- [ ] Frontend running on localhost
- [ ] MetaMask connected
- [ ] Faucet tokens received
- [ ] Mint transaction successful
- [ ] Burn transaction successful
- [ ] Transaction history working
- [ ] System metrics displaying correctly

---

## 🎉 Congratulations!

You now have a fully functional BBT Token System running locally with:
- ✅ Real smart contracts on Avalanche Fuji testnet
- ✅ Premium frontend with glassmorphic design
- ✅ Complete transaction history and logging
- ✅ Real wallet integration and signing
- ✅ Faucet for test token distribution
- ✅ Mint and burn functionality
- ✅ Real-time system monitoring

**Your BBT Protocol is ready for testing and development! 🚀**

---

*For questions or issues, please refer to the troubleshooting section or create an issue on GitHub.* 