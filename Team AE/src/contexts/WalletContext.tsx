
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  signMessage: (message: string) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is already connected on page load
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected. Please install MetaMask to continue.');
      return false;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        toast.success('Wallet connected successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('Please connect to MetaMask to continue.');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
      return false;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    toast.success('Wallet disconnected');
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!window.ethereum || !account) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });
      return signature;
    } catch (error: any) {
      console.error('Error signing message:', error);
      if (error.code === 4001) {
        toast.error('Signature cancelled by user');
      } else {
        toast.error('Failed to sign message');
      }
      return null;
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      account,
      connectWallet,
      disconnectWallet,
      signMessage,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
