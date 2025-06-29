# Drapo App V2 - E-Bhutan Digital Identity & Citizenship Platform 🚀

## Overview

The **E-Bhutan Digital Identity & Citizenship Platform** is a comprehensive decentralized digital identity and reputation system for Bhutanese citizens. It enables users to securely prove personhood, access verifiable credentials, and build social credibility through blockchain-based attestations, while providing government services and digital currency management.

## Pitch Deck & Loom

docs/pitch.pptx

Loom video: https://www.loom.com/share/63f2e307a07843d89ae3a7894998293b

## Team Members

Kiran Sukumaran - [GitHub](https://github.com/Kiransukumaran), [LinkedIn](https://linkedin.com/in/kiran-sukumaran)

## Features

### 1️⃣ Decentralized Digital Identity (DID) & Digital Passport

- Users create **Self-Sovereign Identity (SSI)** stored on a decentralized ledger
- Generates a **Bhutanese Digital Passport** for secure international travel
- Issues **verifiable credentials** (education, business, tax compliance)
- **Biometric authentication** (Face & Fingerprint) for enhanced security
- **Zero-Knowledge Proofs (zkProofs)** for privacy-preserving verification

### 2️⃣ Proof-of-Personhood (PoP) & Reputation System

- Identity verification through:
  - **AI-powered facial recognition** & government-issued documents
  - **Web3-based proof** (Soulbound Tokens & zkProofs)
- Users **earn reputation points** for verified contributions (community work, education, business)
- Reputation score unlocks **premium services, scholarships, and business opportunities**
- **Smart contract-based trust system** with verifiable attestations

### 3️⃣ Bitcoin-Backed Digital Currency & Wallet

- **Bitcoin-backed stablecoin** pegged to Bhutanese Ngultrum
- **Digital wallet** for sending, receiving, and exchanging currencies
- **Reserve management** with transparent Bitcoin backing
- **Secure transaction system** with blockchain verification

### 4️⃣ eResidency & Business Services

- **Digital business registration** and incorporation
- **Tax management** and compliance services
- **Document verification** and secure storage
- **NFT-based certificates** and credentials

### 5️⃣ Sovereign AI Assistant

- **AI-powered government services** assistance
- **Legal help** and regulatory guidance
- **Dzongkha language support** for local accessibility
- **Bhutanese law FAQ** and compliance guidance

### 6️⃣ Secure Identity Verification & Document Storage

- AI-powered **OCR scanning** for document verification
- Secure credential storage using **IPFS/Filecoin**
- Identity protection using **Zero-Knowledge Proofs (zkProofs)**
- **Selective disclosure** of personal information

---

## Tech Stack

### **Frontend**

- **Next.js 15** (React framework with App Router)
- **TypeScript** (Type-safe development)
- **Tailwind CSS** (Modern styling)
- **Next-intl** (Internationalization)

### **Backend**

- **Node.js** with **Express.js** (REST API)
- **Prisma** (Database ORM)
- **PostgreSQL** (Primary database)
- **Veramo** (DID and verifiable credentials)
- **MinIO** (Object storage)

### **Blockchain & Identity Storage**

- **Ethereum/Polygon** (for smart contracts & verifiable credentials)
- **IPFS/Filecoin** (for decentralized document storage)
- **DID (Decentralized Identifiers)** for self-sovereign identity

### **AI/ML**

- **Facial Recognition** (for biometric identity verification)
- **OCR (Optical Character Recognition)** (for document verification)
- **Natural Language Processing** (for AI assistant)

### **Smart Contracts**

- **Solidity** (for trust-based reputation system & verifiable credentials)
- **Web3.js/Ethers.js** (Blockchain interaction)

---

## Use Case Examples

### **1️⃣ Citizen Onboarding**

- Registers using **biometrics & ID scan**
- A **DID (Decentralized Identity)** is created
- **Digital passport** is issued for travel

### **2️⃣ Digital Identity & Credentials**

- Citizens receive **verifiable Bhutanese digital passport**
- Government issues **education certificates as verifiable credentials**
- **Business licenses** and **tax compliance** as blockchain attestations

### **3️⃣ Reputation & Proof-of-Personhood**

- Users earn **reputation points** for verified contributions (volunteering, education, business)
- Reputation unlocks **premium government services, funding, and business opportunities**
- **Smart contracts** validate and issue attestations

### **4️⃣ Digital Currency & Transactions**

- Citizens use **Bitcoin-backed stablecoin** for daily transactions
- **Digital wallet** for secure payments and transfers
- **Currency exchange** with transparent reserves

### **5️⃣ Business Services**

- **Digital company registration** with instant verification
- **Tax management** and compliance tracking
- **Document verification** through blockchain

### **6️⃣ AI-Powered Assistance**

- **Government service guidance** in Dzongkha and English
- **Legal compliance** and regulatory help
- **24/7 AI assistant** for citizen queries

---

## Deployment Guide

### **1️⃣ Setup the Project**

```sh
git clone https://github.com/your-repo/e-bhutan-platform.git
cd e-bhutan-platform
```

### **2️⃣ Backend Setup**

```sh
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### **3️⃣ Frontend Setup**

```sh
cd frontend
npm install
npm run dev
```

### **4️⃣ Environment Configuration**

Create `.env` files in both backend and frontend directories:

**Backend (.env):**

```sh
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
MINIO_ACCESS_KEY="your_minio_key"
MINIO_SECRET_KEY="your_minio_secret"
VERAMO_SECRET_KEY="your_veramo_key"
```

**Frontend (.env.local):**

```sh
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="E-Bhutan"
```

### **5️⃣ Smart Contract Deployment**

```sh
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

---

## Why This is a Game-Changer? 🚀

✅ **Provides secure digital identity for all Bhutanese citizens**  
✅ **Enables Bitcoin-backed digital currency with transparency**  
✅ **Builds trust & reputation through blockchain-based attestations**  
✅ **Offers comprehensive government services through AI assistance**  
✅ **Uses decentralized storage & AI for security & privacy**  
✅ **Empowers citizens with self-sovereign identity and control**

---

## Architecture

### **Citizen Services**

- Digital Identity Management (DID, Passport, Credentials)
- Reputation & Trust System (Proof-of-Personhood, Attestations)
- Digital Wallet & Currency Management
- Business Services (Registration, Tax, Documents)
- AI Assistant (Government Services, Legal Help)

### **Admin Panel**

- System Overview & Analytics
- User & DID Management
- Reputation System Administration
- Smart Contract Management
- Currency & Reserve Management
- Business Services Administration
- AI System Management

---

## Contribution

Want to contribute? Follow our [Contribution Guide](CONTRIBUTING.md)!

## Author

[@kiransukumaran](https://github.com/Kiransukumaran)

---

## License

This project is **open-source** under the **MIT License**.

---

## Contact

📧 Email: **contact@ebhutan.io**  
🌍 Website: **[www.ebhutan.io](https://www.ebhutan.io)**
