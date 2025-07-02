import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  isLoading: boolean;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isLoading: false
  });

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      // Check if we're on Polygon network (0x89 = 137 in decimal)
      const polygonChainId = '0x89';
      
      if (chainId !== polygonChainId) {
        try {
          // Try to switch to Polygon network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: polygonChainId }]
          });
        } catch (switchError: any) {
          // If the chain hasn't been added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: polygonChainId,
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      setWalletState({
        isConnected: true,
        address: accounts[0],
        chainId: polygonChainId,
        isLoading: false
      });

      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      setWalletState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      isLoading: false
    });
    toast.success('Wallet disconnected');
  }, []);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    formatAddress
  };
};