Druk e‑Portal — Estonia walked so Bhutan could build the upgrade

Estonia proved that e-residency drives national income and global trust. But its system is Web2-native — centralized, opaque, and vulnerable to data leaks and security breaches.

It lacks self-sovereign identity, transparent credentialing, and modular governance — all essential for a blockchain- and AI-native future.

Governments today need a verifiable, privacy-respecting, and secure-by-design digital operating system.

Druk e‑Portal is that system.
It’s not a prototype — it’s a modular, configurable stack ready for Bhutan now, and scalable for any digital nation tomorrow.

## 🌐 What It Does (Functional)

- **Digital Residency** — Apply from anywhere, get verified, and receive sovereign credentials.
- **Verifiable Credentials** — Standards-based identity issued with DID & VC (JSON-LD).
- **Residency NFT** — Soulbound digital passport minted on-chain.
- **Business Formation** — Register your DAO, SoloOp, or virtual company.
- **Public Directory** — Browse verified residents and entities without revealing private identity data.
- **Verifier API** — Validate credentials without exposing private data.
- **Real ZK Proofs** — Circom circuits + SnarkJS for Bhutan nationality verification without revealing identity.
- **Admin Panel** — Manage KYC approvals and residency requests, furhter integrate third party APIs or agent to automate back office.

## 🛠️ Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js (Express) or Python (FastAPI)Druk e‑Portal — 

- **Database**: Primarily Polygon; MongoDB used in a few places due to Polygon free-tier limits. Ready for full Polygon integration in production.
- **Web3**: Solidity, Hardhat, Polygon Mumbai (testnet)
- **Standards**: W3C Verifiable Credentials (VC), Decentralized Identifiers (DID)
- **Zero-Knowledge**: Circom circuits, SnarkJS, Groth16 protocol

## 📦 Project Structure

```
eResidency-MVP/
├── frontend/            # Next Js + Tailwind
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


## 💡 The Future

Druk e‑Portal is not just a hackathon build — it’s a production-grade blueprint for digital nation-state infrastructure.

Bhutan can lead the world in trust, compliance, and institutional clarity.

Draper Nation and other network states can extend this into experimental digital sovereignty.

Every module is configurable, built with scalability in mind — from governance rules to identity issuance.

Ready to integrate with third-party APIs, AI agents, and compliance systems.

Open-source and modular by design, allowing nations and platforms to plug in or fork as needed.

Empowers users to choose digital citizenship, control identity, and launch borderless ventures — all through a single, sovereign platform.

## 👥 Credits

Built by [@oliursahin](https://oliursahin.co.uk) & [@sajdakabir](https://github.com/sajdakabir).
