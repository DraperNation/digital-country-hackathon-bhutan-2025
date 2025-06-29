require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ELGDfdZIc556ZVQzPATT3LN6CIQeK3Wy",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

