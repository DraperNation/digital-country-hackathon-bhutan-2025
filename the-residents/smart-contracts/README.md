# eResidency NFT Smart Contract

A soulbound (non-transferable) ERC721 token implementation for eResidency on the Polygon Mumbai testnet.

## Features

- **Soulbound Tokens**: Non-transferable NFTs that are permanently bound to the recipient's wallet
- **ERC721 Standard**: Implements the ERC721 standard for NFTs
- **Metadata Storage**: Stores eResidency details including name, citizenship country, and eResidency ID
- **Access Control**: Only the contract owner can mint new tokens

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Hardhat
- MetaMask (or other Web3 wallet)
- Mumbai testnet MATIC (get some from a [Polygon faucet](https://faucet.polygon.technology/))

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MUMBAI_RPC_URL=your_mumbai_rpc_url
   PRIVATE_KEY=your_wallet_private_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ```

## Compile Contracts

```bash
npm run compile
```

## Run Tests

```bash
npm test
```

## Deploy to Mumbai Testnet

1. Make sure you have MATIC in your wallet on the Mumbai testnet
2. Run the deployment script:
   ```bash
   npm run deploy:mumbai
   ```

## Verify on Polygonscan

After deployment, verify your contract:

```bash
npx hardhat verify --network mumbai <DEPLOYED_CONTRACT_ADDRESS>
```

## Smart Contract Functions

### `mintNFT`

Mint a new eResidency NFT.

```solidity
function mintNFT(
    address to,
    string memory name,
    string memory citizenshipCountry,
    string memory eResidencyId,
    string memory tokenURI
) external onlyOwner returns (uint256)
```

### `getResidencyData`

Get residency data for a specific token.

```solidity
function getResidencyData(uint256 tokenId) external view returns (
    string memory name,
    string memory citizenshipCountry,
    string memory eResidencyId,
    uint256 timestamp
)
```

### `tokenOfOwner`

Get the token ID owned by a specific address.

```solidity
function tokenOfOwner(address owner) external view returns (uint256)
```

## Security Considerations

- The contract owner has the power to mint NFTs to any address
- Tokens are soulbound and cannot be transferred after minting
- Always verify the contract on Polygonscan after deployment
- Use a secure wallet and never expose your private key

## License

MIT
