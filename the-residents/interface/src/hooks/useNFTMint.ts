'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface MintStatus {
  hasMinted: boolean;
  tokenId?: string;
  contractAddress?: string;
  transactionHash?: string;
  mintedAt?: string;
}

interface MintResult {
  success: boolean;
  transactionHash?: string;
  tokenId?: string;
  eResidencyId?: string;
  contractAddress?: string;
  error?: string;
  synced?: boolean;
  message?: string;
  syncedAt?: string;
}

export function useNFTMint() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null);

  const connectWallet = async () => {
    try {
      connect({ connector: injected() });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const saveWalletAddress = async (userId: string, walletAddress: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/wallet`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          walletAddress
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save wallet address');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving wallet address:', error);
      throw error;
    }
  };

  const checkMintStatus = async (userId: string): Promise<MintStatus | null> => {
    try {
      const response = await fetch(`http://localhost:8000/api/residency/status/${userId}`);
      
      if (response.status === 404) {
        return { hasMinted: false };
      }
      
      if (!response.ok) {
        throw new Error('Failed to check mint status');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking mint status:', error);
      return null;
    }
  };

  const mintNFT = async (userId: string): Promise<MintResult> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/residency/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mint NFT');
      }

      // Update mint status after successful mint or sync
      const newMintStatus = await checkMintStatus(userId);
      if (newMintStatus) {
        setMintStatus(newMintStatus);
      }

      return data;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const syncNFT = async (userId: string): Promise<MintResult> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/residency/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync NFT');
      }

      // Update mint status after successful sync
      const newMintStatus = await checkMintStatus(userId);
      if (newMintStatus) {
        setMintStatus(newMintStatus);
      }

      return data;
    } catch (error) {
      console.error('Error syncing NFT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Wallet connection
    address,
    isConnected,
    connectWallet,
    disconnect,
    saveWalletAddress,
    
    // NFT minting and syncing
    mintNFT,
    syncNFT,
    checkMintStatus,
    isLoading,
    mintStatus,
    setMintStatus,
  };
} 