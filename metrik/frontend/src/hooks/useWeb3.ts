import { useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useChainId, useSwitchChain } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { type Address } from 'viem';

export function useWeb3() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsInitialized(true);
    }
  }, [isConnected]);

  const connectWallet = useCallback(async () => {
    try {
      if (connectors[0]) {
        await connect({ connector: connectors[0] });
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      throw err;
    }
  }, [connect, connectors]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      throw err;
    }
  }, [disconnect]);

  const switchToMainnet = useCallback(async () => {
    try {
      if (switchChain) {
        await switchChain({ chainId: mainnet.id });
      }
    } catch (err) {
      console.error('Error switching network:', err);
      throw err;
    }
  }, [switchChain]);

  const getShortAddress = useCallback((address: Address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    address,
    isConnected,
    isConnecting,
    isInitialized,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToMainnet,
    getShortAddress,
  };
} 