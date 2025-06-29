# Bhutan eResidency: Digital Residency for the World

## 🌍 Problem

Entrepreneurs worldwide face barriers when incorporating companies in trustworthy jurisdictions. Bhutan, like Estonia, has the potential to become a global hub for remote businesses—but lacks a digital residency offering.

## 💡 Solution

A digital eResidency platform that enables anyone to:
- Apply for Bhutanese digital residency
- Get verified through a KYC flow (mocked for demo)
- Receive a digital residency ID as an NFT
- View and share residency credentials via a personal dashboard

## 🚀 Project Flow

1. User visits site → fills basic form (name, passport, country)
2. Submits → identity verification (mocked with 5s delay)
3. After verification, issue eResident ID
   - Minted as NFT on Polygon Mumbai Testnet
   - Generates a digital ID card with user data
4. User dashboard displays:
   - Name, status (approved), ID issued
   - QR code or NFT link
   - Digital ID card

## 🛠️ Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Thirdweb SDK

### Backend
- Node.js API
- Mocked KYC verification
- NFT minting endpoint

### Blockchain
- Polygon Mumbai Testnet
- ERC-721 NFTs
- IPFS for metadata storage

## 🏗️ Project Structure

```
/bhutan-eresidency
├── /frontend          # Next.js application
├── /backend           # Node.js API server
├── /smart-contracts   # Solidity contracts
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask wallet (for blockchain interactions)

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```
4. Start the development servers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Estonia's e-Residency program
- Built for the Bhutan Tech Hackathon 2024
