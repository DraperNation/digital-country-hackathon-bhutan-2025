import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { formatAmount } from '@/lib/utils/contracts';
import { toast } from 'react-toastify';

export function usePlatformFees() {
  const { contract: lendingPoolContract } = useContract('lendingPool');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [platformFees, setPlatformFees] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch platform fees
  const fetchPlatformFees = useCallback(async () => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
      setPlatformFees('0');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const fees = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'platformFees',
        args: [],
      });

      setPlatformFees(formatAmount(fees as bigint, 6)); // USDC has 6 decimals
    } catch (err) {
      console.error('Error fetching platform fees:', err);
      setError(err as Error);
      setPlatformFees('0');
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  // Withdraw platform fees
  const withdrawPlatformFees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!lendingPoolContract || !lendingPoolContract.address || !lendingPoolContract.abi) {
        throw new Error('Lending pool contract not available.');
      }

      if (!address) {
        throw new Error('Wallet not connected.');
      }

      if (!publicClient) {
        throw new Error('Public client not available. Please ensure network is connected.');
      }

      if (!walletClient) {
        throw new Error('Wallet client not available. Please ensure your wallet is connected.');
      }

      // Simulate the withdrawal transaction
      const { request } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'withdrawPlatformFees',
        args: [],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Platform fees withdrawn successfully!');
      
      // Refresh the fees amount
      await fetchPlatformFees();
      
      return hash;
    } catch (err) {
      console.error('Error withdrawing platform fees:', err);
      setError(err as Error);
      toast.error('Failed to withdraw platform fees. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lendingPoolContract, address, publicClient, walletClient, fetchPlatformFees]);

  // Effect to fetch data on address change
  useEffect(() => {
    fetchPlatformFees();

    const interval = setInterval(() => {
      fetchPlatformFees();
    }, 15000); // Refetch every 15 seconds

    return () => clearInterval(interval);
  }, [fetchPlatformFees]);

  return {
    platformFees,
    isLoading,
    error,
    withdrawPlatformFees,
    refetch: fetchPlatformFees,
  };
} 