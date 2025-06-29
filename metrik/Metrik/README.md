# Metrik DeFi Credit Protocol

A decentralized credit protocol that allows suppliers to tokenize invoices into NFTs and borrow against them from a shared lending pool.

## Overview

The protocol consists of several key components:

1. **InvoiceNFT**: ERC721 token representing credit-based invoices
2. **LendingPool**: Manages deposits, borrows, and repayments
3. **Staking**: Handles METRIK token staking and tier management
4. **RewardDistribution**: Distributes interest to LPs and stakers
5. **FeeManager**: Manages origination fees and treasury

## Features

- Invoice tokenization as NFTs
- 60% borrow cap against invoice value
- Tiered staking system with duration multipliers
- Automated interest distribution
- Liquidation mechanism for overdue loans
- Origination fee management

## Smart Contracts

### InvoiceNFT
- ERC721 token for invoice representation
- Metadata includes invoice details and verification status
- Transfer restrictions for unverified invoices

### LendingPool
- Deposit and withdraw stablecoins
- Borrow against verified invoices
- Repay loans with interest
- Liquidate overdue loans

### Staking
- Multiple staking durations (45d, 90d, 180d, 365d)
- Tiered system (Bronze, Silver, Gold, Diamond)
- Duration-based point multipliers

### RewardDistribution
- 80/20 split between LPs and stakers
- Tier-based reward distribution
- Automated reward claims

### FeeManager
- 1.5% default origination fee
- Configurable fee rates
- Treasury management

## Development

### Prerequisites
- Node.js v16+
- npm or yarn
- Hardhat

### Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
```

### Testing
Run the test suite:
```bash
npx hardhat test
```

### Deployment
Deploy to a network:
```bash
npx hardhat run scripts/deploy.ts --network <network>
```

## Security

The protocol implements several security measures:
- ReentrancyGuard for all external functions
- SafeERC20 for token transfers
- Access control with Ownable
- Input validation and checks
- Event emission for all state changes

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
