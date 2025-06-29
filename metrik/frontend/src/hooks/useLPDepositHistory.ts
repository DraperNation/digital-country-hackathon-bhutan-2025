import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount } from 'wagmi';
import { formatAmount } from '@/lib/utils/contracts';
import { useAnimatedValue } from './useAnimatedValue';

export interface LPDeposit {
  amount: string;
  depositTime: Date;
  withdrawnAmount: string;
  interestAccrued: string;
  isActive: boolean;
}

export interface LPStats {
  totalDeposited: string;
  totalWithdrawn: string;
  totalInterest: string;
  activeDeposits: string;
}

export function useLPDepositHistory() {
  const { contract: lendingPoolContract } = useContract('lendingPool');
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [deposits, setDeposits] = useState<LPDeposit[]>([]);
  const [lpStats, setLpStats] = useState<LPStats>({
    totalDeposited: '0',
    totalWithdrawn: '0',
    totalInterest: '0',
    activeDeposits: '0',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch LP deposit history
  const fetchLPDepositHistory = useCallback(async () => {
    if (!publicClient || !lendingPoolContract.address || !lendingPoolContract.abi || !address) {
      setDeposits([]);
      setLpStats({
        totalDeposited: '0',
        totalWithdrawn: '0',
        totalInterest: '0',
        activeDeposits: '0',
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get LP info
      const lpInfo = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'lpInfo',
        args: [address],
      });

      // Get total LP interest
      const totalInterest = await publicClient.readContract({
        address: lendingPoolContract.address,
        abi: lendingPoolContract.abi,
        functionName: 'getLPInterest',
        args: [address],
      });

      // For now, we'll create a simplified deposit history
      // In the actual contract, you might need to loop through lpDeposits mapping
      const depositHistory: LPDeposit[] = [];
      
      if (Array.isArray(lpInfo) && lpInfo.length >= 3) {
        const depositAmount = formatAmount(lpInfo[0], 6); // USDC has 6 decimals
        const interestAccrued = formatAmount(lpInfo[1], 6);
        const lastUpdateTime = new Date(Number(lpInfo[2]) * 1000);
        
        if (Number(depositAmount) > 0) {
          depositHistory.push({
            amount: depositAmount,
            depositTime: lastUpdateTime,
            withdrawnAmount: '0', // This would need to be tracked separately
            interestAccrued: formatAmount(totalInterest as bigint, 6),
            isActive: true,
          });
        }
      }

      setDeposits(depositHistory);

      // Calculate stats
      const totalDeposited = depositHistory.reduce((sum, deposit) => sum + Number(deposit.amount), 0);
      const totalWithdrawn = depositHistory.reduce((sum, deposit) => sum + Number(deposit.withdrawnAmount), 0);
      const totalInterestEarned = depositHistory.reduce((sum, deposit) => sum + Number(deposit.interestAccrued), 0);
      const activeDeposits = depositHistory.filter(deposit => deposit.isActive).length;

      setLpStats({
        totalDeposited: totalDeposited.toFixed(6),
        totalWithdrawn: totalWithdrawn.toFixed(6),
        totalInterest: totalInterestEarned.toFixed(6),
        activeDeposits: activeDeposits.toString(),
      });

    } catch (err) {
      console.error('Error fetching LP deposit history:', err);
      setError(err as Error);
      setDeposits([]);
      setLpStats({
        totalDeposited: '0',
        totalWithdrawn: '0',
        totalInterest: '0',
        activeDeposits: '0',
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, lendingPoolContract.address, lendingPoolContract.abi, address]);

  // Effect to fetch data on address change
  useEffect(() => {
    if (address) {
      fetchLPDepositHistory();

      const interval = setInterval(() => {
        fetchLPDepositHistory();
      }, 15000); // Refetch every 15 seconds

      return () => clearInterval(interval);
    }
  }, [address, fetchLPDepositHistory]);

  // Animated values for smooth UI updates
  const animatedStats = {
    totalDeposited: useAnimatedValue(lpStats.totalDeposited, 800, 'ease-out'),
    totalWithdrawn: useAnimatedValue(lpStats.totalWithdrawn, 800, 'ease-out'),
    totalInterest: useAnimatedValue(lpStats.totalInterest, 800, 'ease-out'),
    activeDeposits: useAnimatedValue(lpStats.activeDeposits, 800, 'ease-out'),
  };

  return {
    deposits,
    lpStats,
    animatedStats,
    isLoading,
    error,
    refetch: fetchLPDepositHistory,
  };
} 