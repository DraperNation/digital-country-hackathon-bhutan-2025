# BTNX - Bhutan Bitcoin Currency

The world's first sovereign Bitcoin-backed digital currency with transparent reserves, multi-signature security, and global interoperability.

> 🎥 **Watch a quick demo:** [Loom Video Overview](https://www.loom.com/share/460a230f55744195a802491a5d9c7ed9?sid=dfb3a860-648e-4b2d-b3fa-b60a4769eedb)

## 🌟 Overview

BTNX (Bhutan eXpress) is a Bitcoin-backed stablecoin that maintains a 200% collateral ratio, ensuring stability and trust in the digital currency ecosystem. For every 2 Bitcoins deposited, users receive 1 BTNX, providing over-collateralization for enhanced security.

## 🏗️ Architecture

The project consists of three main components:

- **Smart Contracts** (`btnx/`): Ethereum smart contracts for BTNX token management
- **Backend API** (`btnx/scripts/`): Node.js/Express API for transaction processing
- **Frontend** (`frontend/`): React/TypeScript web application with modern UI

## 🚀 Features

### Core Features
- **200% Collateral Ratio**: 2 BTC = 1 BTNX for enhanced stability
- **Real-time Market Data**: Live Bitcoin prices and USD/BTN exchange rates
- **Bitcoin Redemption**: Deposit Bitcoin to receive BTNX tokens
- **Transaction History**: Complete audit trail of all transfers
- **Multi-signature Security**: Enhanced security for wallet operations
- **Transparent Reserves**: Public verification of backing assets

### Technical Features
- **Smart Contract Integration**: ERC-20 token with mint/burn capabilities
- **Real-time Price Feeds**: CoinGecko API integration for live BTC prices
- **Exchange Rate API**: Live USD to Bhutanese Ngultrum (BTN) rates
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui
- **TypeScript**: Full type safety across the application
- **Web3 Integration**: Wallet connection and blockchain interactions

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (for transaction storage)
- **MetaMask** or compatible Web3 wallet
- **Sepolia Testnet ETH** (for testing)
- **Bitcoin Testnet** (for testing)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd btnx-coin
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd btnx
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend Environment (.env in btnx/ directory)
```env
PRIVATE_KEY=your_ethereum_private_key
MONGODB_URI=your_mongodb_connection_string
PORT=4000
```

#### Frontend Environment (.env in frontend/ directory)
```env
VITE_API_URL=http://localhost:4000
VITE_CONTRACT_ADDRESS=0x6f2548B040278E3B65C0158BfD38371e7e9c6712
```

## 🚀 Running the Application

### 1. Compile Smart Contracts
```bash
cd btnx
npx hardhat compile
```

### 2. Start the Backend API
```bash
# From the btnx directory
npx hardhat run scripts/test-transfer.js --network sepolia
```

The API will be available at `http://localhost:4000`

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Deploy Smart Contracts (Optional)
```bash
cd btnx
npx hardhat run scripts/deploy.js --network sepolia
```

## 📱 Usage

### Connecting Wallet
1. Open the application in your browser
2. Click "Connect Wallet" in the navigation
3. Approve the connection in MetaMask
4. Ensure you're connected to Sepolia testnet

### Sending BTNX
1. Navigate to the "Send BTNX" section
2. Enter the recipient's Ethereum address
3. Specify the amount of BTNX to send
4. Click "Send BTNX" and confirm the transaction

### Redeeming BTNX with Bitcoin
1. Go to the "Redeem BTNX with BTC" section
2. Copy the provided Bitcoin testnet address
3. Send Bitcoin to that address from your Bitcoin wallet
4. Enter the Bitcoin transaction hash and amount
5. Provide your Ethereum address for receiving BTNX
6. Click "Redeem BTNX" to process the redemption

### Viewing Transaction History
- All transactions are automatically displayed in the Transaction History section
- Filter between sent and received transactions
- View transaction details including hash and timestamps

## 🔧 API Endpoints

### Authentication & Balance
- `GET /api/balance/:address` - Get BTNX balance for an address

### Transactions
- `POST /api/transfer` - Send BTNX to another address
- `POST /api/redeem` - Redeem Bitcoin for BTNX
- `GET /transfers` - Get transaction history

### Request Examples

#### Send BTNX
```bash
curl -X POST http://localhost:4000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "receiver": "0x...",
    "amt": 100
  }'
```

#### Redeem Bitcoin
```bash
curl -X POST http://localhost:4000/api/redeem \
  -H "Content-Type: application/json" \
  -d '{
    "btcTx": "transaction_hash",
    "ethAddress": "0x...",
    "btcAmount": 0.001
  }'
```

## 🏛️ Smart Contract Details

### BTNX Token Contract
- **Name**: Bhutan eXpress
- **Symbol**: BTNX
- **Decimals**: 18
- **Network**: Sepolia Testnet
- **Address**: `0x6f2548B040278E3B65C0158BfD38371e7e9c6712`

### Key Functions
- `mint(address to, uint256 amount)` - Mint new BTNX tokens
- `burn(address from, uint256 amount)` - Burn BTNX tokens
- `transfer(address to, uint256 amount)` - Transfer BTNX tokens
- `setController(address _controller)` - Set minting controller

## 🔒 Security Features

### Collateral Ratio
- **200% Over-collateralization**: 2 BTC required for 1 BTNX
- **Real-time Price Verification**: Live Bitcoin price feeds
- **Transaction Validation**: Comprehensive input validation
- **Duplicate Prevention**: Prevents double-spending of Bitcoin transactions

### Smart Contract Security
- **OpenZeppelin Contracts**: Battle-tested security standards
- **Access Control**: Restricted minting and burning functions
- **Ownable Pattern**: Secure ownership management

## 📊 Market Data Integration

### Real-time Feeds
- **Bitcoin Price**: CoinGecko API integration
- **USD/BTN Rate**: ExchangeRate-API integration
- **Auto-refresh**: Updates every 5 minutes
- **Fallback Values**: Graceful degradation if APIs fail

### Display Features
- Live Bitcoin price with USD formatting
- Bhutanese Ngultrum exchange rates
- Collateral ratio visualization
- Market data timestamps

## 🧪 Testing

### Smart Contract Testing
```bash
cd btnx
npx hardhat test
```

### API Testing
```bash
# Test balance endpoint
curl http://localhost:4000/api/balance/0x...

# Test transfer endpoint
curl -X POST http://localhost:4000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"receiver": "0x...", "amt": 10}'
```

## 📁 Project Structure

```
btnx-coin/
├── btnx/                          # Smart contracts & backend
│   ├── contracts/
│   │   └── BTNX.sol              # Main token contract
│   ├── scripts/
│   │   ├── deploy.js             # Contract deployment
│   │   ├── mint.js               # Token minting
│   │   ├── test-transfer.js      # Main API server
│   │   └── set-controller.js     # Controller setup
│   ├── restapi/
│   │   ├── api.js                # REST API
│   │   ├── db.js                 # Database connection
│   │   └── models/
│   │       └── Transfer.js       # Transaction model
│   └── hardhat.config.js         # Hardhat configuration
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── MarketData.tsx    # Market data display
│   │   │   ├── SendCoinUi.tsx    # Send/redeem interface
│   │   │   ├── TransactionHistory.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   └── Index.tsx         # Main page
│   │   └── ...
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the smart contract comments for technical details

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic BTNX token functionality
- ✅ Bitcoin redemption system
- ✅ Real-time market data
- ✅ Transaction history

### Phase 2 (Planned)
- 🔄 Multi-signature wallet integration
- 🔄 Advanced security features
- 🔄 Mobile application
- 🔄 API rate limiting

### Phase 3 (Future)
- 🔮 Cross-chain interoperability
- 🔮 DeFi integrations
- 🔮 Governance mechanisms
- 🔮 Advanced analytics

## ⚠️ Disclaimer

This is a testnet implementation for educational and development purposes. The smart contracts have not been audited for production use. Always test thoroughly before deploying to mainnet.

---

**Built with ❤️ for the Bhutanese digital economy** 
  
