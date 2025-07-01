import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount } from 'wagmi';
import { formatAmount } from '@/lib/utils/contracts';
import { useAnimatedValue } from './useAnimatedValue';

export interface StakeInfo {
  amount: string;
  points: string;
  startTime: Date;
  lastUpdateTime: Date;
  duration: number;
}

export interface StakeHistory {
  amount: string;
  startTime: Date;
  duration: number;
  usedForBorrow: string;
}

export interface StakeUsage {
  total: string;
  used: string;
  free: string;
}

export function useStakingHistory() {
  const { contract: stakingContract } = useContract('staking');
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [activeStakes, setActiveStakes] = useState<StakeInfo[]>([]);
  const [stakeHistory, setStakeHistory] = useState<StakeHistory[]>([]);
  const [stakeUsage, setStakeUsage] = useState<StakeUsage>({
    total: '0',
    used: '0',
    free: '0'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Animated values for smooth UI updates
  const animatedStakeUsage = {
    total: useAnimatedValue(stakeUsage.total, 800, 'ease-out'),
    used: useAnimatedValue(stakeUsage.used, 800, 'ease-out'),
    free: useAnimatedValue(stakeUsage.free, 800, 'ease-out'),
  };

  // Fetch all active stakes
  const fetchActiveStakes = useCallback(async () => {
    if (!publicClient || !stakingContract.address || !stakingContract.abi || !address) {
      setActiveStakes([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const stakes = await publicClient.readContract({
        address: stakingContract.address,
        abi: stakingContract.abi,
        functionName: 'getActiveStakes',
        args: [address],
      });

      if (Array.isArray(stakes)) {
        const formattedStakes: StakeInfo[] = stakes.map((stake: any) => ({
          amount: formatAmount(stake.amount),
          points: formatAmount(stake.points),
          startTime: new Date(Number(stake.startTime) * 1000),
          lastUpdateTime: new Date(Number(stake.lastUpdateTime) * 1000),
          duration: Number(stake.duration),
        }));
        setActiveStakes(formattedStakes);
      } else {
        setActiveStakes([]);
      }
    } catch (err) {
      console.error('Error fetching active stakes:', err);
      setError(err as Error);
      setActiveStakes([]);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, stakingContract.address, stakingContract.abi, address]);

  // Fetch stake history
  const fetchStakeHistory = useCallback(async () => {
    if (!publicClient || !stakingContract.address || !stakingContract.abi || !address) {
      setStakeHistory([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const historyLength = await publicClient.readContract({
        address: stakingContract.address,
        abi: stakingContract.abi,
        functionName: 'getStakeHistoryLength',
        args: [address],
      });

      const length = Number(historyLength);
      const history: StakeHistory[] = [];

      for (let i = 0; i < length; i++) {
        const stakeRecord = await publicClient.readContract({
          address: stakingContract.address,
          abi: stakingContract.abi,
          functionName: 'stakeHistory',
          args: [address, BigInt(i)],
        });

        if (Array.isArray(stakeRecord) && stakeRecord.length === 4) {
          history.push({
            amount: formatAmount(stakeRecord[0]),
            startTime: new Date(Number(stakeRecord[1]) * 1000),
            duration: Number(stakeRecord[2]),
            usedForBorrow: formatAmount(stakeRecord[3]),
          });
        }
      }

      setStakeHistory(history);
    } catch (err) {
      console.error('Error fetching stake history:', err);
      setError(err as Error);
      setStakeHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, stakingContract.address, stakingContract.abi, address]);

  // Fetch stake usage
  const fetchStakeUsage = useCallback(async () => {
    if (!publicClient || !stakingContract.address || !stakingContract.abi || !address) {
      setStakeUsage({ total: '0', used: '0', free: '0' });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const usage = await publicClient.readContract({
        address: stakingContract.address,
        abi: stakingContract.abi,
        functionName: 'getStakeUsage',
        args: [address],
      });

      if (Array.isArray(usage) && usage.length === 3) {
        setStakeUsage({
          total: formatAmount(usage[0]),
          used: formatAmount(usage[1]),
          free: formatAmount(usage[2]),
        });
      } else {
        setStakeUsage({ total: '0', used: '0', free: '0' });
      }
    } catch (err) {
      console.error('Error fetching stake usage:', err);
      setError(err as Error);
      setStakeUsage({ total: '0', used: '0', free: '0' });
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, stakingContract.address, stakingContract.abi, address]);

  // Fetch all staking data
  const fetchAllStakingData = useCallback(async () => {
    await Promise.all([
      fetchActiveStakes(),
      fetchStakeHistory(),
      fetchStakeUsage(),
    ]);
  }, [fetchActiveStakes, fetchStakeHistory, fetchStakeUsage]);

  // Effect to fetch data on address change
  useEffect(() => {
    if (address) {
      fetchAllStakingData();

      const interval = setInterval(() => {
        fetchAllStakingData();
      }, 30000); // Refetch every 30 seconds instead of 15 to reduce UI flickering

      return () => clearInterval(interval);
    }
  }, [address, fetchAllStakingData]);

  return {
    activeStakes,
    stakeHistory,
    stakeUsage,
    isLoading,
    error,
    refetch: fetchAllStakingData,
    // Animated values for smooth UI updates
    animatedStakeUsage,
  };
} 