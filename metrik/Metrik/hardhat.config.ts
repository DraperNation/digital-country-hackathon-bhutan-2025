import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    fuji: {
      url: process.env.RPC_URL || "https://avax-fuji.g.alchemy.com/v2/et1rPFAksGvhozOYHrNmk",
      chainId: 43113,
      timeout: 60000,
      accounts: [
        process.env.PRIVATE_KEY_OWNER || "",
        process.env.PRIVATE_KEY_SUPPLIER || "",
        process.env.PRIVATE_KEY_LP || "",
        process.env.PRIVATE_KEY_BUYER || ""
      ].filter(key => key !== "")
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
