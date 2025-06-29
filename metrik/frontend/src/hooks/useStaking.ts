import { useState, useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import { parseAmount, formatAmount } from '@/lib/utils/contracts';
import { type Hash } from 'viem';
import { toast } from 'react-toastify';
import { useAnimatedValue } from './useAnimatedValue';

export function useStaking() {
  const { contract: stakingContract } = useContract('staking');
  const { contract: metrikContract } = useContract('metrikToken');
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [rewards, setRewards] = useState<string>('0');
  const [stakeDuration, setStakeDuration] = useState<number>(0);
  const [currentTier, setCurrentTier] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [metrikBalance, setMetrikBalance] = useState<bigint | undefined>(undefined);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isBalanceError, setIsBalanceError] = useState(false);
  const [balanceError, setBalanceError] = useState<Error | null>(null);

  // Animated values for smooth UI updates
  const animatedStakedAmount = useAnimatedValue(stakedAmount, 800, 'ease-out');
  const animatedRewards = useAnimatedValue(rewards, 800, 'ease-out');
  const animatedMetrikBalance = useAnimatedValue(
    metrikBalance !== undefined ? formatAmount(metrikBalance) : '0',
    800,
    'ease-out'
  );

  // Fetch staked balance and info
  const fetchStakedInfo = useCallback(async () => {
    if (!publicClient || !stakingContract.address || !stakingContract.abi || !address) {
      setStakedAmount('0');
      setStakeDuration(0);
      setRewards('0');
      setCurrentTier(0);
      return;
    }
    
    try {
      // Use getStakeUsage instead of getStakeInfo to avoid array bounds error
      const usageData = await publicClient.readContract({
        address: stakingContract.address,
        abi: stakingContract.abi,
        functionName: 'getStakeUsage',
        args: [address],
      });
      
      if (Array.isArray(usageData) && usageData.length === 3) {
        const totalStaked = usageData[0] as bigint;
        const usedStaked = usageData[1] as bigint;
        const freeStaked = usageData[2] as bigint;
        
        // Set the total staked amount
        setStakedAmount(formatAmount(totalStaked));
        
        // Get tier based on total staked amount
        try {
          const tier = await publicClient.readContract({
            address: stakingContract.address,
            abi: stakingContract.abi,
            functionName: 'getTier',
            args: [address],
          });
          setCurrentTier(Number(tier));
        } catch (tierError) {
          console.error('Error fetching tier:', tierError);
          setCurrentTier(0);
        }
        
        // For now, we'll set rewards to 0 as there's no direct rewards function
        setRewards('0');
        
        // Try to get duration from active stakes if any exist
        try {
          const activeStakes = await publicClient.readContract({
            address: stakingContract.address,
            abi: stakingContract.abi,
            functionName: 'getActiveStakes',
            args: [address],
          });
          
          if (Array.isArray(activeStakes) && activeStakes.length > 0) {
            // Use the duration from the first active stake
            const firstStake = activeStakes[0];
            if (Array.isArray(firstStake) && firstStake.length >= 5) {
              const duration = Number(firstStake[4]); // duration is at index 4
              setStakeDuration(duration);
            } else {
              setStakeDuration(0);
            }
          } else {
            setStakeDuration(0);
          }
        } catch (stakesError) {
          console.error('Error fetching active stakes:', stakesError);
          setStakeDuration(0);
        }
      } else {
        // No stakes found
        setStakedAmount('0');
        setStakeDuration(0);
        setRewards('0');
        setCurrentTier(0);
      }
    } catch (err) {
      console.error('Error fetching stake info:', err);
      // Don't throw error, just set default values
      setStakedAmount('0');
      setStakeDuration(0);
      setRewards('0');
      setCurrentTier(0);
    }
  }, [publicClient, stakingContract.address, stakingContract.abi, address]);

  // Fetch METRIK balance
  const fetchMetrikBalance = useCallback(async () => {
    setIsBalanceLoading(true);
    setIsBalanceError(false);
    setBalanceError(null);
    if (!publicClient || !metrikContract.address || !metrikContract.abi || !address) {
      setMetrikBalance(undefined);
      setIsBalanceLoading(false);
      return;
    }
    try {
      const data = await publicClient.readContract({
        address: metrikContract.address,
        abi: metrikContract.abi,
        functionName: 'balanceOf',
        args: [address],
      });
      setMetrikBalance(data as bigint);
    } catch (err) {
      console.error('Error fetching METRIK balance:', err);
      setIsBalanceError(true);
      setBalanceError(err as Error);
      setMetrikBalance(undefined);
    } finally {
      setIsBalanceLoading(false);
    }
  }, [publicClient, metrikContract.address, metrikContract.abi, address]);

  // Effect to refetch data on address change or periodically
  useEffect(() => {
    if (address) {
      fetchStakedInfo();
      fetchMetrikBalance();

      const interval = setInterval(() => {
        fetchStakedInfo();
        fetchMetrikBalance();
      }, 30000); // Refetch every 30 seconds instead of 15 to reduce UI flickering

      return () => clearInterval(interval);
    }
  }, [address, fetchStakedInfo, fetchMetrikBalance]);

  const stake = useCallback(async (amount: string, duration: number) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!stakingContract || !stakingContract.address || !stakingContract.abi) {
        throw new Error('Staking contract not available.');
      }

      if (!metrikContract || !metrikContract.address || !metrikContract.abi) {
        throw new Error('METRIK token contract not available.');
      }

      if (!address) {
        throw new Error('Wallet not connected.');
      }

      if (!publicClient) {
        throw new Error('Public client not available. Please ensure network is connected.');
      }

      console.log('Current useWalletClient state:', { walletClient: typeof walletClient, walletClientValue: walletClient });
      console.log('Current publicClient chain ID:', publicClient?.chain.id, '(Expected:', publicClient?.chain.id, ')');

      console.log('Checking METRIK balance state:', {
        isBalanceLoading,
        isBalanceError,
        balanceError,
        metrikBalance: metrikBalance?.toString(),
        address
      });

      if (isBalanceLoading) {
        throw new Error('Loading METRIK balance... Please wait.');
      }

      if (isBalanceError) {
        throw new Error(`Error fetching METRIK balance: ${balanceError?.message}`);
      }

      const parsedAmount = parseAmount(amount);
      
      // Check if user has enough balance
      if (typeof metrikBalance !== 'bigint') {
        throw new Error('Invalid METRIK balance format. Please try again.');
      }

      if (parsedAmount > metrikBalance) {
        throw new Error(`Insufficient METRIK balance. You have ${formatAmount(metrikBalance)} but trying to stake ${amount}.`);
      }

      console.log(`Approving ${parsedAmount.toString()} METRIK for staking contract...`);

      // Explicitly ensure duration is a safe BigInt
      const safeDuration = BigInt(Math.max(0, Math.floor(duration || 0)));
      // Convert days to seconds (1 day = 24 * 60 * 60 seconds)
      const durationInSeconds = safeDuration * BigInt(24 * 60 * 60);

      console.log('Approving METRIK tokens...', {
        spender: stakingContract.address,
        amount: parsedAmount.toString(),
        balance: metrikBalance.toString(),
        address,
        duration: durationInSeconds.toString()
      });

      if (!walletClient) {
        throw new Error('Wallet client not available. Please ensure your wallet is connected.');
      }

      // First approve the staking contract to spend METRIK tokens
      let approveTxHash: Hash | undefined;

      console.log('Before approve walletClient.writeContract call.');

      try {
        const { request } = await publicClient!.simulateContract({
          account: address,
          address: metrikContract.address,
          abi: metrikContract.abi,
          functionName: 'approve',
          args: [stakingContract.address, parsedAmount],
        });

        approveTxHash = await walletClient.writeContract(request);
        console.log('approveTxHash result:', approveTxHash);

      } catch (approveError) {
        console.error('Error during approve transaction call:', approveError);
        throw new Error(`Approval transaction failed: ${(approveError as Error).message}`);
      }
      
      if (typeof approveTxHash !== 'string') {
        throw new Error('Transaction approval failed or was rejected. `walletClient.writeContract` did not return a valid transaction hash.');
      }

      console.log('Approval transaction sent:', approveTxHash);

      console.log('Waiting for approval transaction confirmation...');
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: approveTxHash });
      console.log('Approval transaction confirmed:', receipt);

      // Then stake the tokens
      console.log('Staking tokens...', {
        amount: parsedAmount.toString(),
        duration: durationInSeconds.toString()
      });

      let stakeTxHash: Hash | undefined;

      try {
        const { request } = await publicClient!.simulateContract({
          account: address,
          address: stakingContract.address,
          abi: stakingContract.abi,
          functionName: 'stake',
          args: [parsedAmount, durationInSeconds],
        });

        stakeTxHash = await walletClient.writeContract(request);
        console.log('stakeTxHash result:', stakeTxHash);
      } catch (stakeError) {
        console.error('Error during stake transaction call:', stakeError);
        throw new Error(`Staking transaction failed: ${(stakeError as Error).message}`);
      }

      if (typeof stakeTxHash !== 'string') {
        throw new Error('Staking transaction failed or was rejected. `walletClient.writeContract` did not return a valid transaction hash.');
      }
      
      console.log('Stake transaction sent:', stakeTxHash);

      console.log('Waiting for stake transaction confirmation...');
      const stakeReceipt = await publicClient!.waitForTransactionReceipt({ hash: stakeTxHash });
      console.log('Stake transaction confirmed:', stakeReceipt);

      toast.success('Stake successful!');
      return stakeTxHash;
    } catch (err) {
      console.error('Error staking:', err);
      setError(err as Error);
      toast.error('Staking failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [stakingContract, metrikContract, metrikBalance, address, isBalanceLoading, isBalanceError, balanceError, walletClient, publicClient]);

  const unstake = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!stakingContract || !stakingContract.address || !stakingContract.abi) {
        throw new Error('Staking contract not available.');
      }
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }
      const { request } = await publicClient!.simulateContract({
        account: address,
        address: stakingContract.address,
        abi: stakingContract.abi,
        functionName: 'unstake',
      });
      const hash = await walletClient.writeContract(request);
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } catch (err) {
      console.error('Error unstaking:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [stakingContract, walletClient, publicClient, address]);

  const claimRewards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!stakingContract || !stakingContract.address || !stakingContract.abi) {
        throw new Error('Staking contract not available.');
      }
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet client, address, or public client not available.');
      }
      const { request } = await publicClient!.simulateContract({
        account: address,
        address: stakingContract.address,
        abi: stakingContract.abi,
        functionName: 'claimRewards',
      });
      const hash = await walletClient.writeContract(request);
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [stakingContract, walletClient, publicClient, address]);

  return {
    isLoading: isLoading || isBalanceLoading,
    error,
    stakedAmount,
    rewards,
    stakeDuration,
    currentTier,
    stake,
    unstake,
    claimRewards,
    metrikBalance: metrikBalance && typeof metrikBalance === 'bigint' ? formatAmount(metrikBalance) : '0',
    // Animated values for smooth UI updates
    animatedStakedAmount,
    animatedRewards,
    animatedMetrikBalance,
  };
} 