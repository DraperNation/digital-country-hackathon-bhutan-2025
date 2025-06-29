import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { parseAmount, formatAmount } from '@/lib/utils/contracts';
import { toast } from 'react-toastify';
import { useAnimatedValue } from './useAnimatedValue';

export interface RepaymentLoan {
  invoiceId: string;
  amount: string;
  dueDate: Date;
  isRepaid: boolean;
  isLiquidated: boolean;
  interestAccrued: string;
  totalAmount: string;
  daysUntilDue: number;
  isOverdue: boolean;
}

export interface RepaymentStats {
  totalOutstanding: string;
  totalInterest: string;
  overdueLoans: string;
  activeLoans: string;
  totalRepaid: string;
}

export function useRepay() {
  const { contract: lendingPoolContract } = useContract('lendingPool');
  const { contract: usdcContract } = useContract('usdc');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [outstandingLoans, setOutstandingLoans] = useState<RepaymentLoan[]>([]);
  const [repaymentStats, setRepaymentStats] = useState<RepaymentStats>({
    totalOutstanding: '0',
    totalInterest: '0',
    overdueLoans: '0',
    activeLoans: '0',
    totalRepaid: '0',
  });
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Animated values for smooth UI updates
  const animatedStats = {
    totalOutstanding: useAnimatedValue(repaymentStats.totalOutstanding, 800, 'ease-out'),
    totalInterest: useAnimatedValue(repaymentStats.totalInterest, 800, 'ease-out'),
    overdueLoans: useAnimatedValue(repaymentStats.overdueLoans, 800, 'ease-out'),
    activeLoans: useAnimatedValue(repaymentStats.activeLoans, 800, 'ease-out'),
    totalRepaid: useAnimatedValue(repaymentStats.totalRepaid, 800, 'ease-out'),
  };
  const animatedUsdcBalance = useAnimatedValue(usdcBalance, 800, 'ease-out');

  const fetchOutstandingLoans = useCallback(async () => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi || !address) {
      setOutstandingLoans([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get user's total borrowed amount
      const totalBorrowed = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getUserTotalBorrowed',
        args: [address],
      }) as bigint;

      // For now, we'll create a mock loan since getting individual loans requires more complex logic
      // In a real implementation, you'd fetch actual loan details from the contract
      const mockLoans: RepaymentLoan[] = [];
      const totalInterest = BigInt(0);
      const overdueCount = 0;
      let activeCount = 0;

      if (totalBorrowed > BigInt(0)) {
        // Create a mock loan for demonstration
        const mockLoan: RepaymentLoan = {
          invoiceId: '1',
          amount: formatAmount(totalBorrowed),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isRepaid: false,
          isLiquidated: false,
          interestAccrued: '0',
          totalAmount: formatAmount(totalBorrowed),
          daysUntilDue: 30,
          isOverdue: false,
        };
        mockLoans.push(mockLoan);
        activeCount = 1;
      }

      setOutstandingLoans(mockLoans);

      // Update stats
      setRepaymentStats({
        totalOutstanding: formatAmount(totalBorrowed),
        totalInterest: formatAmount(totalInterest),
        overdueLoans: overdueCount.toString(),
        activeLoans: activeCount.toString(),
        totalRepaid: '0', // This would be calculated from historical data
      });
    } catch (err) {
      console.error('Error fetching outstanding loans:', err);
      setError(err as Error);
      setOutstandingLoans([]);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi, address]);

  const fetchUsdcBalance = useCallback(async () => {
    if (!publicClient || !usdcContract.address || !usdcContract.abi || !address) {
      setUsdcBalance('0');
      return;
    }

    try {
      const balance = await publicClient.readContract({
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      setUsdcBalance(formatAmount(balance));
    } catch (err) {
      console.error('Error fetching USDC balance:', err);
      setUsdcBalance('0');
    }
  }, [publicClient, usdcContract.address, usdcContract.abi, address]);

  const getLoanDetails = useCallback(async (invoiceId: string) => {
    try {
      if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
        return null;
      }

      const loanDetails = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getUserLoanDetails',
        args: [address!, BigInt(invoiceId)],
      }) as [bigint, bigint, boolean, boolean, bigint];

      if (loanDetails) {
        const [amount, dueDate, isRepaid, isLiquidated, interestAccrued] = loanDetails;
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        const isOverdue = currentTime > dueDate && !isRepaid && !isLiquidated;
        const daysUntilDue = isOverdue ? 0 : Math.max(0, Math.floor(Number(dueDate - currentTime) / (24 * 60 * 60)));

        return {
          invoiceId,
          amount: formatAmount(amount),
          dueDate: new Date(Number(dueDate) * 1000),
          isRepaid,
          isLiquidated,
          interestAccrued: formatAmount(interestAccrued),
          totalAmount: formatAmount(amount + interestAccrued),
          daysUntilDue,
          isOverdue,
        };
      }
      return null;
    } catch (err) {
      console.error('Error getting loan details:', err);
      return null;
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi, address]);

  const repay = useCallback(async (invoiceId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }

      // Get loan details to calculate total amount to repay
      const loanDetails = await getLoanDetails(invoiceId);
      if (!loanDetails) {
        throw new Error('Loan not found or not active.');
      }

      // Check if user has enough USDC balance
      const requiredAmount = parseAmount(loanDetails.totalAmount);
      const currentBalance = parseAmount(usdcBalance);
      
      if (requiredAmount > currentBalance) {
        throw new Error(`Insufficient USDC balance. You need ${loanDetails.totalAmount} but have ${usdcBalance}.`);
      }

      // First approve the lending pool to spend USDC
      const { request: approveRequest } = await publicClient.simulateContract({
        account: address,
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: 'approve',
        args: [lendingPoolContract.address, requiredAmount],
      });

      const approveHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Then repay the loan
      const { request: repayRequest } = await publicClient.simulateContract({
        account: address,
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'repay',
        args: [BigInt(invoiceId)],
      });

      const repayHash = await walletClient.writeContract(repayRequest);
      await publicClient.waitForTransactionReceipt({ hash: repayHash });

      // Refresh data
      await fetchOutstandingLoans();
      await fetchUsdcBalance();

      toast.success('Repayment successful!');
      return repayHash;
    } catch (err) {
      console.error('Error repaying loan:', err);
      setError(err as Error);
      toast.error('Repayment failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, publicClient, lendingPoolContract.address, lendingPoolContract.abi, usdcContract.address, usdcContract.abi, getLoanDetails, usdcBalance, fetchOutstandingLoans, fetchUsdcBalance]);

  const calculateInterest = useCallback(async (principal: string, startTime: Date) => {
    try {
      if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi) {
        return '0';
      }

      const principalBigInt = parseAmount(principal);
      const startTimeBigInt = BigInt(Math.floor(startTime.getTime() / 1000));
      const currentTime = BigInt(Math.floor(Date.now() / 1000));

      const interest = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'calculateInterest',
        args: [principalBigInt, startTimeBigInt, BigInt(1000)], // 10% APR
      }) as bigint;

      return formatAmount(interest);
    } catch (err) {
      console.error('Error calculating interest:', err);
      return '0';
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi]);

  // Effect to fetch data on address change or periodically
  useEffect(() => {
    if (address) {
      fetchOutstandingLoans();
      fetchUsdcBalance();

      const interval = setInterval(() => {
        fetchOutstandingLoans();
        fetchUsdcBalance();
      }, 30000); // Refetch every 30 seconds

      return () => clearInterval(interval);
    }
  }, [address, fetchOutstandingLoans, fetchUsdcBalance]);

  return {
    outstandingLoans,
    repaymentStats,
    usdcBalance,
    isLoading,
    error,
    repay,
    getLoanDetails,
    calculateInterest,
    refetch: () => {
      if (address) {
        fetchOutstandingLoans();
        fetchUsdcBalance();
      }
    },
    // Animated values for smooth UI updates
    animatedStats,
    animatedUsdcBalance,
  };
} 