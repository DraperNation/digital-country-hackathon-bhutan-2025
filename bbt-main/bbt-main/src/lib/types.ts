// Avalanche/Web3 types for BBT Token System

export interface Account {
  owner: string; // Ethereum address
  subaccount?: string;
}

export interface SystemMetrics {
  totalSupply: number;
  reserveBalance: number;
  collateralizationRatio: number;
  btcPrice: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  isPaused: boolean;
  circulatingSupply: number;
}

export interface UserBalance {
  bbt: number;
  reserve: number;
}

export interface TransactionResult {
  success: boolean;
  error?: string;
  hash?: string;
}

export interface Transaction {
  id: string;
  type: 'mint' | 'burn' | 'transfer' | 'faucet';
  amount: number;
  from: string;
  to?: string;
  timestamp: number;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export interface ContractAddresses {
  BBT_TOKEN: string;
  BBT_FAUCET: string;
  RESERVE_TOKEN: string;
}

// Web3 service interface
export interface Web3ServiceInterface {
  connectWallet(): Promise<boolean>;
  getAccount(): Promise<string | null>;
  getSystemMetrics(): Promise<SystemMetrics | null>;
  getUserBalances(): Promise<UserBalance | null>;
  mintBBT(amount: number): Promise<TransactionResult>;
  burnBBT(amount: number): Promise<TransactionResult>;
  requestFaucetTokens(): Promise<TransactionResult>;
  switchNetwork(): Promise<boolean>;
  isConnected(): boolean;
}

// Form validation errors
export interface ValidationErrors {
  amount?: string;
  recipient?: string;
  general?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 