// Enhanced Web3 service for BBT Token System
// This version includes real wallet connection and transaction signing

import { ethers } from "ethers";
import BBTTokenABI from "../contracts/BBTToken.json";
import BBTFaucetABI from "../contracts/BBTFaucet.json";

// Contract addresses (will be updated after deployment)
const CONTRACT_ADDRESSES = {
  BBT_TOKEN: import.meta.env.VITE_BBT_TOKEN_ADDRESS || '',
  BBT_FAUCET: import.meta.env.VITE_BBT_FAUCET_ADDRESS || '',
  RESERVE_TOKEN: import.meta.env.VITE_RESERVE_TOKEN_ADDRESS || '0xd00ae08403B9bbb9124bB305C09058E32C39A48c' // Fuji WAVAX
};

// Network configuration
const NETWORK_CONFIG = {
  chainId: '0xa869', // Fuji testnet
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
};

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
  receipt?: any;
}

export interface TransactionHistory {
  hash: string;
  type: 'mint' | 'burn' | 'faucet';
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  fee?: number;
}

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private bbtContract: ethers.Contract | null = null;
  private faucetContract: ethers.Contract | null = null;
  private isConnected: boolean = false;
  private account: string = '';
  private transactionHistory: TransactionHistory[] = [];

  async init() {
    try {
      console.log('Initializing Web3 service...');
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.isConnected = true;
      
      // Get account
      this.account = await this.signer.getAddress();
      
      // Initialize contracts if addresses are available
      if (CONTRACT_ADDRESSES.BBT_TOKEN) {
        this.bbtContract = new ethers.Contract(
          CONTRACT_ADDRESSES.BBT_TOKEN,
          BBTTokenABI,
          this.signer
        );
      }
      
      if (CONTRACT_ADDRESSES.BBT_FAUCET) {
        this.faucetContract = new ethers.Contract(
          CONTRACT_ADDRESSES.BBT_FAUCET,
          BBTFaucetABI,
          this.signer
        );
      }
      
      // Check if we're on the correct network
      await this.checkAndSwitchNetwork();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountChange.bind(this));
      window.ethereum.on('chainChanged', this.handleChainChange.bind(this));
      
      console.log('Web3 service initialized successfully');
      console.log('Account:', this.account);
      console.log('BBT Contract:', CONTRACT_ADDRESSES.BBT_TOKEN);
      console.log('Faucet Contract:', CONTRACT_ADDRESSES.BBT_FAUCET);
    } catch (error) {
      console.error('Web3 service initialization failed:', error);
      throw error;
    }
  }

  private async handleAccountChange(accounts: string[]) {
    if (accounts.length > 0) {
      this.account = accounts[0];
      console.log('Account changed to:', this.account);
    } else {
      this.isConnected = false;
      this.account = '';
      console.log('Account disconnected');
    }
  }

  private async handleChainChange(chainId: string) {
    console.log('Chain changed to:', chainId);
    if (chainId !== NETWORK_CONFIG.chainId) {
      console.log('Please switch to Avalanche Fuji Testnet');
    }
  }

  async connectWallet(): Promise<boolean> {
    try {
      await this.init();
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  async getAccount(): Promise<string | null> {
    return this.account || null;
  }

  async checkAndSwitchNetwork(): Promise<boolean> {
    try {
      const network = await this.provider!.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      
      if (chainId !== NETWORK_CONFIG.chainId) {
        console.log('Switching to Avalanche Fuji Testnet...');
        await this.switchToFuji();
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  }

  async switchToFuji(): Promise<boolean> {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK_CONFIG]
      });
      return true;
    } catch (error) {
      console.error('Failed to switch to Fuji network:', error);
      throw new Error('Please switch to Avalanche Fuji Testnet in MetaMask');
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics | null> {
    if (!this.bbtContract) {
      return this.getMockSystemMetrics();
    }

    try {
      const [
        totalSupply,
        reserveBalance,
        collateralizationRatio,
        isPaused,
        circulatingSupply
      ] = await Promise.all([
        this.bbtContract.totalSupply(),
        this.bbtContract.getReserveBalance(),
        this.bbtContract.getCollateralizationRatio(),
        this.bbtContract.paused(),
        this.bbtContract.circulatingSupply()
      ]);

      const btcPrice = 45000; // Mock BTC price - in production, get from oracle
      
      const systemHealth = this.calculateSystemHealth(
        ethers.formatEther(collateralizationRatio),
        ethers.formatEther(totalSupply)
      );

      return {
        totalSupply: parseFloat(ethers.formatEther(totalSupply)),
        reserveBalance: parseFloat(ethers.formatEther(reserveBalance)),
        collateralizationRatio: parseFloat(ethers.formatEther(collateralizationRatio)),
        btcPrice,
        systemHealth,
        isPaused,
        circulatingSupply: parseFloat(ethers.formatEther(circulatingSupply))
      };
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      return this.getMockSystemMetrics();
    }
  }

  async getUserBalances(): Promise<UserBalance | null> {
    if (!this.isConnected || !this.provider) {
      return this.getMockUserBalances();
    }

    try {
      // Get native AVAX balance
      const balance = await this.provider.getBalance(this.account);
      const reserveBalance = parseFloat(ethers.formatEther(balance));
      
      // Get BBT balance if contract is available
      let bbtBalance = 0;
      if (this.bbtContract) {
        const bbtBalanceWei = await this.bbtContract.balanceOf(this.account);
        bbtBalance = parseFloat(ethers.formatEther(bbtBalanceWei));
      }
      
      return {
        bbt: bbtBalance,
        reserve: reserveBalance
      };
    } catch (error) {
      console.error('Error fetching user balances:', error);
      return this.getMockUserBalances();
    }
  }

  async mintBBT(amount: number): Promise<TransactionResult> {
    if (!this.isConnected || !this.bbtContract) {
      return { success: false, error: 'Wallet not connected or contract not available' };
    }

    try {
      console.log(`Initiating mint transaction for ${amount} BBT`);
      
      const amountWei = ethers.parseEther(amount.toString());
      
      // Get mint fee and required reserve amount
      const [mintFee, reserveRequired] = await Promise.all([
        this.bbtContract.mintFee(),
        this.bbtContract.getReserveRequiredForMint(amountWei)
      ]);

      const totalReserveRequired = reserveRequired + mintFee;
      
      console.log(`Required reserve: ${ethers.formatEther(totalReserveRequired)} AVAX`);
      console.log(`Mint fee: ${ethers.formatEther(mintFee)} AVAX`);

      // Create transaction
      const tx = await this.bbtContract.mint(amountWei, {
        value: totalReserveRequired
      });

      // Add to transaction history
      const historyEntry: TransactionHistory = {
        hash: tx.hash,
        type: 'mint',
        amount,
        timestamp: Date.now(),
        status: 'pending'
      };
      this.transactionHistory.unshift(historyEntry);

      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Update transaction history
      const historyIndex = this.transactionHistory.findIndex(t => t.hash === tx.hash);
      if (historyIndex !== -1) {
        this.transactionHistory[historyIndex] = {
          ...this.transactionHistory[historyIndex],
          status: 'confirmed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          fee: parseFloat(ethers.formatEther(receipt.gasUsed * receipt.gasPrice))
        };
      }

      console.log('Transaction confirmed:', receipt);
      
      return { 
        success: true, 
        hash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('Mint error:', error);
      
      // Update transaction history if we have a hash
      if (error.transaction?.hash) {
        const historyIndex = this.transactionHistory.findIndex(t => t.hash === error.transaction.hash);
        if (historyIndex !== -1) {
          this.transactionHistory[historyIndex].status = 'failed';
        }
      }
      
      return { success: false, error: this.parseError(error) };
    }
  }

  async burnBBT(amount: number): Promise<TransactionResult> {
    if (!this.isConnected || !this.bbtContract) {
      return { success: false, error: 'Wallet not connected or contract not available' };
    }

    try {
      console.log(`Initiating burn transaction for ${amount} BBT`);
      
      const amountWei = ethers.parseEther(amount.toString());
      
      // Get burn fee
      const burnFee = await this.bbtContract.burnFee();
      console.log(`Burn fee: ${ethers.formatEther(burnFee)} BBT`);

      // Create transaction
      const tx = await this.bbtContract.burn(amountWei);

      // Add to transaction history
      const historyEntry: TransactionHistory = {
        hash: tx.hash,
        type: 'burn',
        amount,
        timestamp: Date.now(),
        status: 'pending'
      };
      this.transactionHistory.unshift(historyEntry);

      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Update transaction history
      const historyIndex = this.transactionHistory.findIndex(t => t.hash === tx.hash);
      if (historyIndex !== -1) {
        this.transactionHistory[historyIndex] = {
          ...this.transactionHistory[historyIndex],
          status: 'confirmed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          fee: parseFloat(ethers.formatEther(receipt.gasUsed * receipt.gasPrice))
        };
      }

      console.log('Transaction confirmed:', receipt);
      
      return { 
        success: true, 
        hash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('Burn error:', error);
      
      // Update transaction history if we have a hash
      if (error.transaction?.hash) {
        const historyIndex = this.transactionHistory.findIndex(t => t.hash === error.transaction.hash);
        if (historyIndex !== -1) {
          this.transactionHistory[historyIndex].status = 'failed';
        }
      }
      
      return { success: false, error: this.parseError(error) };
    }
  }

  async requestFaucetTokens(): Promise<TransactionResult> {
    if (!this.isConnected || !this.faucetContract) {
      return { success: false, error: 'Wallet not connected or faucet not available' };
    }

    try {
      console.log('Requesting faucet tokens...');
      
      // Check if user can request
      const canRequest = await this.faucetContract.canRequest(this.account);
      if (!canRequest) {
        const nextDripTime = await this.faucetContract.getNextDripTime(this.account);
        const cooldownPeriod = await this.faucetContract.cooldownPeriod();
        throw new Error(`Faucet cooldown active. Next request available at: ${new Date(Number(nextDripTime) * 1000).toLocaleString()}`);
      }

      // Create transaction
      const tx = await this.faucetContract.requestTokens();

      // Add to transaction history
      const historyEntry: TransactionHistory = {
        hash: tx.hash,
        type: 'faucet',
        amount: 0, // Will be updated after confirmation
        timestamp: Date.now(),
        status: 'pending'
      };
      this.transactionHistory.unshift(historyEntry);

      console.log('Faucet transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Get drip amount for history
      const dripAmount = await this.faucetContract.dripAmount();
      
      // Update transaction history
      const historyIndex = this.transactionHistory.findIndex(t => t.hash === tx.hash);
      if (historyIndex !== -1) {
        this.transactionHistory[historyIndex] = {
          ...this.transactionHistory[historyIndex],
          amount: parseFloat(ethers.formatEther(dripAmount)),
          status: 'confirmed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          fee: parseFloat(ethers.formatEther(receipt.gasUsed * receipt.gasPrice))
        };
      }

      console.log('Faucet transaction confirmed:', receipt);
      
      return { 
        success: true, 
        hash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('Faucet error:', error);
      
      // Update transaction history if we have a hash
      if (error.transaction?.hash) {
        const historyIndex = this.transactionHistory.findIndex(t => t.hash === error.transaction.hash);
        if (historyIndex !== -1) {
          this.transactionHistory[historyIndex].status = 'failed';
        }
      }
      
      return { success: false, error: this.parseError(error) };
    }
  }

  getTransactionHistory(): TransactionHistory[] {
    return this.transactionHistory;
  }

  private calculateSystemHealth(collateralizationRatio: string, totalSupply: string): 'healthy' | 'warning' | 'critical' {
    const ratio = parseFloat(collateralizationRatio);
    const supply = parseFloat(totalSupply);
    
    if (ratio >= 1.5 && supply > 0) return 'healthy';
    if (ratio >= 1.2) return 'warning';
    return 'critical';
  }

  getMockSystemMetrics(): SystemMetrics {
    return {
      totalSupply: 1250000,
      reserveBalance: 5625000,
      collateralizationRatio: 4.5,
      btcPrice: 45000,
      systemHealth: 'healthy',
      isPaused: false,
      circulatingSupply: 1250000
    };
  }

  getMockUserBalances(): UserBalance {
    return {
      bbt: 1250.5,
      reserve: 2.5
    };
  }

  private parseError(error: any): string {
    if (error.code === 4001) {
      return 'Transaction rejected by user';
    }
    if (error.code === -32603) {
      return 'Internal JSON-RPC error. Please try again.';
    }
    if (error.message?.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    if (error.message?.includes('execution reverted')) {
      return 'Transaction failed. Please check your input and try again.';
    }
    return error.message || 'An unknown error occurred';
  }

  async switchNetwork(): Promise<boolean> {
    return this.switchToFuji();
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }

  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }
}

// Global instance
const web3Service = new Web3Service();

// Type declarations
declare global {
  interface Window {
    ethereum: any;
  }
}

export default web3Service; 