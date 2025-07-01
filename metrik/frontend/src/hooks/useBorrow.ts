import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { parseAmount, formatAmount } from '@/lib/utils/contracts';
import { toast } from 'react-toastify';
import { useAnimatedValue } from './useAnimatedValue';

export interface Loan {
  invoiceId: string;
  amount: string;
  dueDate: Date;
  status: 'active' | 'repaid' | 'liquidated';
  interestAccrued: string;
  borrowTime: Date;
  supplier: string;
  borrowAmount: string;
}

export interface BorrowStats {
  totalLoans: number;
  activeLoans: number;
  repaidLoans: number;
  liquidatedLoans: number;
  totalBorrowed: number;
  totalInterest: number;
  totalRepaid: number;
}

export function useBorrow() {
  const { contract: lendingPoolContract } = useContract('lendingPool');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [borrowStats, setBorrowStats] = useState<BorrowStats>({
    totalLoans: 0,
    activeLoans: 0,
    repaidLoans: 0,
    liquidatedLoans: 0,
    totalBorrowed: 0,
    totalInterest: 0,
    totalRepaid: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animated values for smooth UI updates
  const animatedStats = {
    totalBorrowed: useAnimatedValue(borrowStats.totalBorrowed.toString(), 800, 'ease-out'),
    activeLoans: useAnimatedValue(borrowStats.activeLoans.toString(), 800, 'ease-out'),
    repaidLoans: useAnimatedValue(borrowStats.repaidLoans.toString(), 800, 'ease-out'),
    liquidatedLoans: useAnimatedValue(borrowStats.liquidatedLoans.toString(), 800, 'ease-out'),
    totalInterest: useAnimatedValue(borrowStats.totalInterest.toString(), 800, 'ease-out'),
    totalLoans: useAnimatedValue(borrowStats.totalLoans.toString(), 800, 'ease-out'),
  };

  const getBorrowHistory = useCallback(async (): Promise<Loan[]> => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi || !address) {
      return [];
    }

    try {
      // For now, return mock data since the contract doesn't have a direct way to get all loans
      // In a real implementation, you'd query events or maintain a separate mapping
      return [];
    } catch (err) {
      console.error('Error fetching borrow history:', err);
      return [];
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi, address]);

  const fetchUserLoans = useCallback(async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get user's loans from the borrow registry
      const userLoansData = await getBorrowHistory();
      
      // Calculate statistics
      const activeLoans = userLoansData.filter(loan => loan.status === 'active');
      const repaidLoans = userLoansData.filter(loan => loan.status === 'repaid');
      const liquidatedLoans = userLoansData.filter(loan => loan.status === 'liquidated');
      const totalInterest = userLoansData.reduce((sum, loan) => sum + Number(loan.interestAccrued), 0);
      
      setUserLoans(userLoansData);
      setBorrowStats({
        totalLoans: userLoansData.length,
        activeLoans: activeLoans.length,
        repaidLoans: repaidLoans.length,
        liquidatedLoans: liquidatedLoans.length,
        totalBorrowed: userLoansData.reduce((sum, loan) => sum + Number(loan.amount), 0),
        totalInterest,
        totalRepaid: repaidLoans.reduce((sum, loan) => sum + Number(loan.amount), 0)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loans');
    } finally {
      setIsLoading(false);
    }
  }, [address, getBorrowHistory]);

  const getMaxBorrowAmount = useCallback(async (tokenId: string) => {
    try {
      if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
        return '0';
      }

      const maxBorrow = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getMaxBorrowAmount',
        args: [BigInt(tokenId)],
      }) as bigint;

      return formatAmount(maxBorrow);
    } catch (err) {
      console.error('Error getting max borrow amount:', err);
      return '0';
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  const borrow = useCallback(async (tokenId: string, borrowAmount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      const parsedAmount = parseAmount(borrowAmount);

      // First approve the lending pool to transfer the invoice NFT
      const { request: approveRequest } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'depositInvoiceAndBorrow',
        args: [BigInt(tokenId), parsedAmount],
      });

      const hash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({ hash });

      // Refresh data
      await fetchUserLoans();

      toast.success('Borrow successful!');
      return hash;
    } catch (err) {
      console.error('Error borrowing:', err);
      setError(err instanceof Error ? err.message : 'Borrowing failed');
      toast.error('Borrowing failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, publicClient, lendingPoolContract.address, lendingPoolContract.abi, fetchUserLoans]);

  // Effect to fetch data on address change or periodically
  useEffect(() => {
    if (address) {
      fetchUserLoans();
      
      // Set up polling every 30 seconds
      const interval = setInterval(fetchUserLoans, 30000);
      
      return () => clearInterval(interval);
    }
  }, [address, fetchUserLoans]);

  return {
    userLoans,
    borrowStats,
    animatedStats,
    isLoading,
    error,
    borrow,
    getMaxBorrowAmount,
    refetch: fetchUserLoans,
  };
} 