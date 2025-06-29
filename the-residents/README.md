# Druk e-Portal — The Operating System for Digital Bhutan

Think e-Estonia, but rebuilt for the era of sovereign identity, modular governance, and borderless incorporation.

Druk e-Portal is a digital residency and business formation platform designed for the Kingdom of Bhutan — and compatible with emerging network states like Draper Nation. It allows any global citizen to become a digital resident, receive cryptographic credentials, mint a non-transferable Residency NFT, and register a business — all online, with optional Web3 components.

## 🌐 What It Does

- **Digital Residency** — Apply from anywhere, get verified, and receive sovereign credentials.
- **Verifiable Credentials** — Standards-based identity issued with DID & VC (JSON-LD).
- **Residency NFT** — Soulbound digital passport minted on-chain.
- **Business Formation** — Register your DAO, SoloOp, or virtual company.
- **Public Directory** — Browse verified residents and entities without revealing private identity data.
- **Verifier API** — Validate credentials without exposing private data.
- **Real ZK Proofs** — Circom circuits + SnarkJS for Bhutan nationality verification without revealing identity.
- **Admin Panel** — Manage KYC approvals and residency requests.

## 🛠️ Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js (Express) or Python (FastAPI)
- **Database**: MongoDB
- **Web3**: Solidity, Hardhat, Polygon Mumbai (testnet)
- **Standards**: W3C Verifiable Credentials (VC), Decentralized Identifiers (DID)
- **Zero-Knowledge**: Circom circuits, SnarkJS, Groth16 protocol

## 📦 Project Structure

```
eResidency-MVP/
├── frontend/            # React + Tailwind
├── backend/             # FastAPI / Express
├── smart-contracts/     # Solidity (NFT contract)
├── zk-proof/           # Circom circuits + SnarkJS proofs
├── scripts/             # Deployment & test helpers
```

## ⚙️ Core Flows

- **KYC Onboarding** → Upload ID, selfie, basic info → Pending/Approved
- **Mint eResidency NFT** → Wallet connect + on-chain soulbound NFT
- **Issue Verifiable Credential** → DID + VC JSON (viewable + verifiable)
- **Register Business Entity** → Create DAO / company with PDF certificate
- **Public Directory** → Browse residents/entities with privacy controls (opt-in public profiles)
- **ZK Nationality Proof** → Prove Bhutan citizenship without revealing personal data (Circom + SnarkJS)
- **Verifier Portal** → Paste VC → Get validation result (ZK-ready toggle)

## 🔐 Smart Contracts & ZK Circuits

**eResidencyNFT.sol (ERC-721 Soulbound)**
- One-time mint
- Metadata includes DID, issue date, residency details
- Non-transferable (soulbound logic)

**ZK Proof System (Circom + SnarkJS)**
- `nationality_check.circom` — Full identity verification with Poseidon hashing
- `nationality_simple.circom` — Simplified nationality proof with commitment scheme
- Groth16 protocol for efficient proof generation and verification
- Proves Bhutan citizenship without revealing name, DOB, or other personal data

## 🔗 Live Links (If deployed)

- Frontend
- Backend API Docs
- Smart Contract Explorer
- Demo Credential JSON

## 💡 Vision

Druk e-Portal isn't just a hackathon project — it's a blueprint for a digital nation-state infrastructure. Bhutan can lead in trust, compliance, and institutional clarity. Platforms like Draper Nation can extend it into experimental digital sovereignty.

Let users choose their digital citizenship, control their identity, and build borderless businesses — all through a single, open-source, future-ready platform.

## 👥 Credits

Built by [@oliursahin](https://oliursahin.co.uk) & [@sajdakabir](https://github.com/sajdakabir).
