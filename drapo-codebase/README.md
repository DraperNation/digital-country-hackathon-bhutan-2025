# Drapo App V2 – E-Bhutan Digital Identity & Citizenship Platform

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Ethereum](https://img.shields.io/badge/Ethereum-Smart%20Contracts-6e4c13?logo=ethereum)
![IPFS](https://img.shields.io/badge/IPFS-Storage-65c2cb?logo=ipfs)
![AI/ML](https://img.shields.io/badge/AI/ML-Facial%20Recognition-orange)

## Executive Summary

The **E-Bhutan Digital Identity & Citizenship Platform** is a pioneering, end-to-end solution for secure, decentralized digital identity, reputation, and government services for Bhutanese citizens. By integrating advanced blockchain, AI, and privacy technologies, the platform empowers individuals, businesses, and government agencies to interact with trust, transparency, and efficiency. This document outlines the platform’s architecture, features, and strategic vision, demonstrating its readiness for real-world impact and sustainable growth.

---

## Technical Presentation

- [Pitch Deck (PowerPoint)](docs/pitch.pptx)
- [Loom Video Walkthrough](https://www.loom.com/share/63f2e307a07843d89ae3a7894998293b)

---

## Project Overview

E-Bhutan addresses the urgent need for a unified, secure, and privacy-preserving digital identity system in Bhutan. The platform enables:

- **Self-sovereign identity** for every citizen
- **Verifiable credentials** for education, business, and compliance
- **Reputation and trust-building** through blockchain attestations
- **AI-powered government services** and legal assistance
- **Bitcoin-backed digital currency** and wallet for seamless transactions
- **Business registration, tax, and compliance** in a digital-first environment

---

## Technical Highlights

- **Decentralized Identity (DID) & Digital Passport**: Citizens create and control their own digital identities, secured on a decentralized ledger. The system issues Bhutanese Digital Passports and supports biometric authentication (face, fingerprint) and zero-knowledge proofs for privacy.
- **Proof-of-Personhood & Reputation**: AI-driven facial recognition, document verification, and blockchain-based attestations ensure robust identity validation. Reputation points and smart contract-based trust unlock advanced services and opportunities.
- **Digital Currency & Wallet**: A Bitcoin-backed stablecoin, pegged to the Ngultrum, powers a secure digital wallet for payments, transfers, and transparent reserve management.
- **eResidency & Business Services**: Digital business registration, tax management, NFT-based certificates, and secure document storage streamline compliance and entrepreneurship.
- **Sovereign AI Assistant**: Multilingual AI (including Dzongkha) provides 24/7 government service guidance, legal help, and regulatory support.
- **Secure Document Storage**: Decentralized storage (IPFS/Filecoin) and selective disclosure protect user data and enable verifiable, privacy-preserving document management.

---

## Innovation & Differentiation

- **First-mover in Bhutan**: The only platform to combine DID, blockchain, AI, and digital currency tailored for Bhutanese needs.
- **Privacy by Design**: Zero-knowledge proofs and selective disclosure ensure compliance with global privacy standards.
- **Integrated Reputation System**: Soulbound tokens and smart contracts create a transparent, merit-based trust layer for citizens and businesses.
- **AI-Driven Services**: Natural language processing and OCR enable seamless onboarding, verification, and support in both English and Dzongkha.
- **Modular, Scalable Architecture**: Built for extensibility, supporting future integrations (e.g., new government services, cross-border credentials).

---

## Market Opportunity & Problem Validation

- **National Digital Transformation**: Bhutan’s push for digital government and financial inclusion creates a strong demand for secure, user-centric identity and service platforms.
- **Global Relevance**: The architecture is adaptable for other nations and organizations seeking decentralized identity and compliance solutions.
- **Stakeholder Engagement**: Designed in consultation with government, business, and citizen stakeholders to ensure real-world fit and adoption.

---

## Business Model & Sustainability

- **Platform-as-a-Service**: Government and enterprise clients can license modules (identity, wallet, compliance, AI assistant) for integration.
- **Transaction Fees**: Micro-fees on digital currency transactions and credential issuance.
- **Premium Services**: Advanced reputation-based services, business registration, and compliance tools for enterprises and NGOs.
- **Open-Source Core**: Community-driven innovation and transparency, with commercial support and customization available.

---

## Societal Impact & Scalability

- **Empowering Citizens**: Provides every Bhutanese with secure, portable digital identity and access to essential services.
- **Financial Inclusion**: Bitcoin-backed stablecoin and wallet enable participation in the digital economy for all.
- **Trust & Transparency**: Blockchain-based attestations and open-source code foster trust among citizens, businesses, and government.
- **Scalable & Replicable**: Modular design supports rapid scaling within Bhutan and adaptation for other countries or sectors.

---

## Technical Architecture

### Frontend

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** for modern, responsive UI
- **Next-intl** for internationalization

### Backend

- **Node.js** with **Express.js** (REST API)
- **Prisma** ORM with **PostgreSQL**
- **Veramo** for DID and verifiable credentials
- **MinIO** for object storage

### Blockchain & Storage

- **Ethereum/Polygon** for smart contracts and credentials
- **IPFS/Filecoin** for decentralized document storage
- **DID** for self-sovereign identity

### AI/ML

- **Facial Recognition** for biometric verification
- **OCR** for document validation
- **NLP** for AI assistant and multilingual support

### Smart Contracts

- **Solidity** for reputation and credential logic
- **Web3.js/Ethers.js** for blockchain interaction

---

## Features

### Digital Identity & Passport

- Self-sovereign identity (SSI) for every citizen, anchored on decentralized ledgers
- Bhutanese Digital Passport for secure international travel
- Verifiable credentials for education, business, and tax compliance
- Biometric authentication (face, fingerprint)
- Zero-Knowledge Proofs (zkProofs) for privacy-preserving verification

### Proof-of-Personhood & Reputation

- AI-powered facial recognition and government document verification
- Web3-based proof (Soulbound Tokens, zkProofs)
- Reputation points for verified contributions (community, education, business)
- Smart contract-based trust and verifiable attestations

### Digital Currency & Wallet

- Bitcoin-backed stablecoin pegged to Bhutanese Ngultrum
- Digital wallet for sending, receiving, and exchanging currencies
- Transparent reserve management and blockchain-verified transactions

### eResidency & Business Services

- Digital business registration and incorporation
- Tax management and compliance
- NFT-based certificates and credentials
- Secure document verification and storage (IPFS/Filecoin)

### AI-Powered Government Services

- AI assistant for government services, legal help, and regulatory guidance
- Multilingual support (including Dzongkha)
- Bhutanese law FAQ and compliance guidance

### Security & Privacy

- AI-powered OCR for document verification
- Selective disclosure of personal information
- Identity protection using zkProofs

---

## Deployment & Setup Guide

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/e-bhutan-platform.git
cd e-bhutan-platform
```

### 2. Backend Setup

```sh
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

### 4. Environment Configuration

Create `.env` files in both backend and frontend directories:

**Backend (.env):**

```
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
MINIO_ACCESS_KEY="your_minio_key"
MINIO_SECRET_KEY="your_minio_secret"
VERAMO_SECRET_KEY="your_veramo_key"
```

**Frontend (.env.local):**

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="E-Bhutan"
```

### 5. Smart Contract Deployment

```sh
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

---

## Contribution

We welcome contributions! Please see our [Contribution Guide](CONTRIBUTING.md) for details on how to get involved.

## Author

Kiran Sukumaran  
[GitHub](https://github.com/Kiransukumaran)  
[LinkedIn](https://linkedin.com/in/kiran-sukumaran)

## License

This project is open-source under the **MIT License**.

## Contact

📧 Email: contact@ebhutan.io  
🌍 Website: [www.ebhutan.io](https://www.ebhutan.io)
