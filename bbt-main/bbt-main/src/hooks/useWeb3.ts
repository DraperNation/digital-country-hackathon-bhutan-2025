import { useState, useEffect, useCallback } from 'react';
import { web3Service, SystemMetrics, UserBalance, TransactionResult } from '../lib/web3-service';

export const useWeb3 = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Initialize Web3 service
  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing Web3 hook...');
        setIsInitialized(true);
        
        // Check if MetaMask is available
        if (typeof window.ethereum !== 'undefined') {
          console.log('MetaMask detected');
          setIsInitialized(true);
        } else {
          console.warn('MetaMask not detected, continuing with mock data');
          setIsInitialized(true);
        }
      } catch (err) {
        console.warn('Web3 initialization failed, continuing with mock data:', err);
        setIsInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError('');
      
      const success = await web3Service.connectWallet();
      if (success) {
        setIsConnected(true);
        const accountAddress = await web3Service.getAccount();
        if (accountAddress) {
          setAccount(accountAddress);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      setIsConnected(false);
      setAccount('');
      setError('');
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  }, []);

  // Get system metrics
  const getSystemMetrics = useCallback(async (): Promise<SystemMetrics | null> => {
    try {
      console.log('Getting system metrics...');
      const metrics = await web3Service.getSystemMetrics();
      console.log('System metrics received:', metrics);
      
      if (metrics) {
        return metrics;
      } else {
        // Return mock data if no real data available
        return web3Service.getMockSystemMetrics();
      }
    } catch (err) {
      console.error('Error fetching system metrics:', err);
      // Return mock data on error
      return web3Service.getMockSystemMetrics();
    }
  }, []);

  // Get user balances
  const getUserBalances = useCallback(async (): Promise<UserBalance | null> => {
    if (!isConnected) {
      console.log('User not connected, returning mock balances');
      return web3Service.getMockUserBalances();
    }

    try {
      console.log('Getting user balances...');
      const balances = await web3Service.getUserBalances();
      console.log('User balances received:', balances);
      
      if (balances) {
        return balances;
      } else {
        return web3Service.getMockUserBalances();
      }
    } catch (err) {
      console.error('Error fetching user balances:', err);
      return web3Service.getMockUserBalances();
    }
  }, [isConnected]);

  // Mint BBT tokens
  const mintBBT = useCallback(async (amount: number): Promise<{ success: boolean; error?: string }> => {
    if (!isConnected) {
      console.log('Mock mint operation - user not connected');
      return { success: true };
    }

    try {
      const result = await web3Service.mintBBT(amount);
      return result;
    } catch (err) {
      console.error('Mint error:', err);
      return { success: false, error: 'Transaction failed' };
    }
  }, [isConnected]);

  // Burn BBT tokens
  const burnBBT = useCallback(async (amount: number): Promise<{ success: boolean; error?: string }> => {
    if (!isConnected) {
      console.log('Mock burn operation - user not connected');
      return { success: true };
    }

    try {
      const result = await web3Service.burnBBT(amount);
      return result;
    } catch (err) {
      console.error('Burn error:', err);
      return { success: false, error: 'Transaction failed' };
    }
  }, [isConnected]);

  // Request faucet tokens
  const requestFaucetTokens = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!isConnected) {
      console.log('Mock faucet request - user not connected');
      return { success: true };
    }

    try {
      const result = await web3Service.requestFaucetTokens();
      return result;
    } catch (err) {
      console.error('Faucet request error:', err);
      return { success: false, error: 'Faucet request failed' };
    }
  }, [isConnected]);

  return {
    isInitialized,
    isConnected,
    account,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getSystemMetrics,
    getUserBalances,
    mintBBT,
    burnBBT,
    requestFaucetTokens,
  };
}; 