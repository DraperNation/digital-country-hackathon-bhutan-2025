# DrukNation: Bhutan e-Residency Platform

<div align="center">

![DrukNation Logo](https://github.com/raksha-bv/DrukNation/blob/main/showcase/Logo.png)

*Empowering Digital Residency in the Kingdom of Bhutan*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-Smart%20Contracts-orange)](https://soliditylang.org/)

</div>

## 🏔️ About DrukNation

DrukNation is a full-stack web application for Bhutan's e-Residency, property, and business registration ecosystem. It leverages blockchain smart contracts, wallet integration, and a modern UI/UX to provide a seamless digital residency and business experience.

<div align="center">

![Hero Image](https://github.com/raksha-bv/DrukNation/blob/main/showcase/HeroSection.png)

</div>

## ✨ Key Features

### 🌟 Core Functionality

<img align="right" src="https://github.com/raksha-bv/DrukNation/blob/main/showcase/FeatureSection.png" width="300">

- **E-Residency Application**: Apply for Bhutan e-Residency as an individual or business, upload KYC documents, and track application status.
- **KYC Verification Dashboard**: Verifiers can review, approve, and mint NFT certificates for pending KYC applications. Includes business listing verification.
- **NFT Residency Certificate**: Upon KYC approval, users receive a blockchain-based NFT certificate as proof of digital residency.

<br clear="right"/>

### 🏢 Business & Property

<img align="left" src="https://github.com/raksha-bv/DrukNation/blob/main/showcase/BusinessApplication.png" width="300">

- **Business Registration**: Businesses can apply for listing, upload documents, and track verification status.
- **Property Listing**: Explore and verify property listings, with animated and grid backgrounds for a modern look.
- **Wallet Integration**: Connect MetaMask or other Web3 wallets to interact with smart contracts and manage residency/business status.

<br clear="left"/>

### 🎨 User Experience

<div align="center">

![UI/UX Features](https://github.com/raksha-bv/DrukNation/blob/main/showcase/CTA_Section.png)

</div>

- **Chatbot**: AI-powered chatbot for user support and guidance throughout the application process.
- **Animated & Grid Backgrounds**: Visually appealing animated and grid backgrounds on all main pages, with UI elements always accessible.
- **Modern UI/UX**: Responsive layouts, Lucide icons, and clean card-based dashboards for all user and verifier flows.
- **Toast Notifications**: All alerts and status messages use toast notifications for a non-intrusive, modern experience.

### 🔧 Technical Stack

<div align="center">

| Frontend | Backend | Blockchain | Storage |
|----------|---------|------------|---------|
| ![Next.js](https://via.placeholder.com/100x60/000000/FFFFFF?text=Next.js) | ![Node.js](https://via.placeholder.com/100x60/339933/FFFFFF?text=Node.js) | ![Solidity](https://via.placeholder.com/100x60/363636/FFFFFF?text=Solidity) | ![IPFS](https://via.placeholder.com/100x60/65C2CB/FFFFFF?text=IPFS) |

</div>

- **TypeScript & React**: Built with Next.js, React, and TypeScript for type safety and maintainability.
- **Pinata IPFS Integration**: KYC/NFT metadata and documents are uploaded to IPFS via Pinata for decentralized storage.
- **Role-based Access**: Verifier and owner roles enforced for KYC/business verification actions.
- **Mobile Responsive**: All pages and dashboards are fully responsive for desktop and mobile use.

## 📱 Screenshots

<div align="center">

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x500/1F2937/FFFFFF?text=User+Dashboard+Screenshot)

### KYC Verification Process
![KYC Process](https://github.com/raksha-bv/DrukNation/blob/main/showcase/KYC_Verification.png)

# NFT Certificate

## Overview
This section showcases the NFT Certificate functionality with three different views and perspectives.

## Certificate Gallery

### Main Certificate Display
<div align="center">
  <img src="https://github.com/raksha-bv/DrukNation/blob/main/showcase/NFT.png" alt="Main NFT Certificate View" width="200"/>
</div>

---

### Certificate Details & Metadata
<div style="display: flex; align-items: center; gap: 20px;">
  <img src="https://github.com/raksha-bv/DrukNation/blob/main/showcase/MetaMaskNFT.png" alt="Certificate Details and Metadata" width="300"/>
  <img src="https://github.com/raksha-bv/DrukNation/blob/main/showcase/NFT-Details.png" alt="Mobile Certificate View" width="300"/>
</div>

---

## Features

- **Secure Certificate Generation**: Blockchain-based certificate creation
- **Immutable Records**: Tamper-proof certificate storage
- **Easy Verification**: Quick certificate authenticity checks
- **Cross-Platform**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
DrukNation/
├── 📁 frontend/          # Next.js app with all UI, pages, and components
├── 📁 backend/           # Node.js/Express backend for chatbot and API routes
├── 📁 contracts/        # Solidity smart contracts for e-Residency, KYC, NFT, and business logic
├── 📄 README.md
└── 📄 package.json
```


## 🚀 Quick Start

### Prerequisites

<div align="center">

![Prerequisites](https://via.placeholder.com/600x150/EF4444/FFFFFF?text=Node.js+%7C+MetaMask+%7C+Git)

</div>

- Node.js 16+ 
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/druknation.git
   cd druknation
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   .env --> NEXT_PUBLIC_PINATA_JWT="your_key"
   
   # Backend
   cd ../backend && npm install
   .env --> GEMINI_API_KEY=""
   npm start
   
   
   
   ```

3. **Run the application**
   ```bash
   # Start all services
   npm run dev
   ```


## 🛠️ How to Run

See each subfolder's README or package.json for detailed setup and run instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for demonstration and educational purposes. For production use, review and audit all smart contracts and backend logic.

---

<div align="center">

![Footer](https://github.com/raksha-bv/DrukNation/blob/main/showcase/Footer.png)

**Made with ❤️ for the Kingdom of Bhutan**

[Website](https://druknation.com) • [Documentation](https://docs.druknation.com) • [Support](mailto:support@druknation.com)

</div>
