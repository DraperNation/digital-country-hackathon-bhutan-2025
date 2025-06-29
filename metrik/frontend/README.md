# Metrik Frontend

Welcome to the **Metrik** frontend! This is the user interface for the Metrik DeFi platform, where users can stake, lend, borrow, and manage their assets on-chain with a seamless, modern experience.

---

## 🚀 Project Purpose
Metrik is a decentralized finance (DeFi) platform that enables:
- **Suppliers** to stake tokens, create invoices, borrow against invoices, and repay loans.
- **Liquidity Providers (LPs)** to deposit USDC, earn interest, and withdraw funds.
- **Owners/Admins** to manage platform fees and monitor protocol health.

This frontend is built with **Next.js** and **React**, providing a fast, responsive, and user-friendly dashboard for all users.

---

## ✨ Main Features
- **Dashboard views** for Suppliers, LPs, and Owners
- **Staking** and **unstaking** tokens
- **Invoice creation** and management
- **Borrowing** against invoices
- **Repayment** of loans
- **LP deposit/withdrawal** with animated stats and per-deposit interest withdrawal
- **Real-time, animated stats** and smooth background refreshes
- **Wallet connection** (MetaMask, WalletConnect, etc.)
- **Smart contract integration** via up-to-date ABIs
- **Modern, responsive UI** with loading skeletons and error handling

---

## 📁 Folder Structure
```
frontend/
├── src/
│   ├── app/                # Next.js app routes and pages
│   ├── components/         # Reusable React components (dashboard, tables, forms, etc.)
│   ├── hooks/              # Custom React hooks (contract calls, state, etc.)
│   ├── lib/
│   │   └── contracts/
│   │       └── abis/       # Smart contract ABIs (JSON)
│   └── public/             # Static assets
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── eslint.config.mjs       # Linting rules
├── tsconfig.json           # TypeScript config
└── README.md               # This file
```

---

## ⚙️ Setup & Installation
1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-org/metrik.git
   cd metrik/frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (RPC URLs, contract addresses, etc.)

---

## 🏗️ Running & Developing
- **Start the dev server:**
  ```bash
  npm run dev
  # or
  bun run dev
  ```
  The app will be available at [http://localhost:3000](http://localhost:3000)

- **Build for production:**
  ```bash
  npm run build
  # or
  bun run build
  ```

- **Lint & format code:**
  ```bash
  npm run lint
  npm run format
  ```

---

## 🔗 Smart Contract ABIs
- All contract ABIs are stored in `src/lib/contracts/abis/`.
- **If you update or redeploy contracts:**
  1. Recompile your contracts (e.g., with Hardhat or Foundry).
  2. Copy the new ABI JSON files into `src/lib/contracts/abis/`.
  3. The frontend will automatically use the latest ABIs.

---

## 🛠️ Environment Variables
- `.env` contains all sensitive and environment-specific config.
- Typical variables:
  - `NEXT_PUBLIC_RPC_URL` — your Ethereum/Polygon/other RPC endpoint
  - `NEXT_PUBLIC_CONTRACT_ADDRESS_LENDINGPOOL` — deployed LendingPool contract address
  - `NEXT_PUBLIC_CONTRACT_ADDRESS_STAKING` — deployed Staking contract address
  - `NEXT_PUBLIC_INVOICE_NFT_ADDRESS` - deployed contract for NFTs
  - `NEXT_PUBLIC_METRIK_TOKEN_ADDRESS` - METRIK Token contract address
  - `NEXT_PUBLIC_STABLECOIN_ADDRESS` - StableCoin or Bitcoin wrapped token for testing (erc20)

---

## 🤝 Contributing
- **Open to PRs and issues!**
- Please follow the existing code style and naming conventions.
- Write clear commit messages and document any new features or changes.
- If you add new contract functions, update the ABI and document the change in this README.

---

## 💬 Support & Questions
- For help, open an issue or start a discussion on GitHub.
- For urgent questions, contact the core team via Discord or email.

---

## 📜 License
This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

**Happy building with Metrik! 🚀**
