import { useState, useCallback } from 'react';
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { type Address, type Abi } from 'viem';

interface ContractConfig {
  address: Address;
  abi: Abi;
}

export function useContractState<TReadResult = any, TWriteResult = any>() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const [readState, setReadState] = useState<TReadResult | undefined>(undefined);
  const [readLoading, setReadLoading] = useState(false);
  const [readError, setReadError] = useState<Error | null>(null);

  const [writeLoading, setWriteLoading] = useState(false);
  const [writeError, setWriteError] = useState<Error | null>(null);
  const [writeResult, setWriteResult] = useState<TWriteResult | undefined>(undefined);

  const readContractState = useCallback(async (
    contract: ContractConfig,
    functionName: string,
    args?: any[],
    enabled: boolean = true
  ) => {
    if (!publicClient || !contract.address || !contract.abi || !enabled) {
      setReadState(undefined);
      return;
    }

    setReadLoading(true);
    setReadError(null);
    try {
      const result = await publicClient.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
      });
      setReadState(result as TReadResult);
    } catch (err) {
      console.error(`Error reading ${functionName}:`, err);
      setReadError(err as Error);
      setReadState(undefined);
    } finally {
      setReadLoading(false);
    }
  }, [publicClient]);

  const writeContractState = useCallback(async (
    contract: ContractConfig,
    functionName: string,
    args?: any[]
  ) => {
    setWriteLoading(true);
    setWriteError(null);
    setWriteResult(undefined);
    try {
      if (!walletClient || !address) {
        throw new Error('Wallet not connected or wallet client not available.');
      }
      if (!publicClient) {
        throw new Error('Public client not available.');
      }

      const { request } = await publicClient!.simulateContract({
        account: address,
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
      });

      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      
      setWriteResult(receipt as TWriteResult);
      return hash;
    } catch (err) {
      console.error(`Error writing ${functionName}:`, err);
      setWriteError(err as Error);
      throw err;
    } finally {
      setWriteLoading(false);
    }
  }, [walletClient, publicClient, address]);

  return {
    readState,
    readLoading,
    readError,
    readContractState,
    writeLoading,
    writeError,
    writeResult,
    writeContractState,
  };
} 