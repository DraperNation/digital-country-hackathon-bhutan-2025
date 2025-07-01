import { http } from 'wagmi';
import { createConfig } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/config';
import { type Abi } from 'viem';
import stakingAbi from '../../lib/contracts/abis/Staking.json';
import lendingPoolAbi from '../../lib/contracts/abis/LendingPool.json';
import invoiceNFTAbi from '../../lib/contracts/abis/InvoiceNFT.json';
import mockERC20Abi from '../../lib/contracts/abis/MockERC20.json';
import borrowRegistryAbi from '../../lib/contracts/abis/BorrowRegistry.json';
import { avalancheFuji } from 'viem/chains';

export const SUPPORTED_CHAINS = [avalancheFuji] as const;

export const CONTRACT_ABIS = {
  STAKING: stakingAbi.abi,
  LENDING_POOL: lendingPoolAbi.abi,
  INVOICE_NFT: invoiceNFTAbi.abi,
  MOCK_ERC20: mockERC20Abi.abi,
  BORROW_REGISTRY: borrowRegistryAbi.abi,
} as const;

export const config = createConfig({
  chains: SUPPORTED_CHAINS,
  transports: {
    [SUPPORTED_CHAINS[0].id]: http(),
  },
});

type ContractConfig = {
  address: `0x${string}`;
  abi: Abi;
};

export const contracts = {
  staking: {
    address: CONTRACT_ADDRESSES.STAKING as `0x${string}`,
    abi: CONTRACT_ABIS.STAKING as Abi,
  },
  lendingPool: {
    address: CONTRACT_ADDRESSES.LENDING_POOL as `0x${string}`,
    abi: CONTRACT_ABIS.LENDING_POOL as Abi,
  },
  invoiceNFT: {
    address: CONTRACT_ADDRESSES.INVOICE_NFT as `0x${string}`,
    abi: CONTRACT_ABIS.INVOICE_NFT as Abi,
  },
  metrikToken: {
    address: CONTRACT_ADDRESSES.METRIK_TOKEN as `0x${string}`,
    abi: CONTRACT_ABIS.MOCK_ERC20 as Abi,
  },
  usdc: {
    address: CONTRACT_ADDRESSES.USDC as `0x${string}`,
    abi: CONTRACT_ABIS.MOCK_ERC20 as Abi,
  },
} as const; 