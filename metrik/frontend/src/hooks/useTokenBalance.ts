import { useState, useCallback, useEffect } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { type Address } from 'viem';
import { contracts } from '@/lib/wagmi/config';
import { formatAmount } from '@/lib/utils/contracts';

export function useTokenBalance() {
  const { address } = useAccount();
  const [balances, setBalances] = useState<{
    metrik: string;
    usdc: string;
    eth: string;
  }>({
    metrik: '0',
    usdc: '0',
    eth: '0',
  });

  // Read METRIK token balance
  const { data: metrikBalance } = useReadContract({
    address: contracts.metrikToken.address,
    abi: contracts.metrikToken.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read USDC token balance
  const { data: usdcBalance } = useReadContract({
    address: contracts.usdc.address,
    abi: contracts.usdc.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read native token (AVAX) balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // Update balances when data changes
  useEffect(() => {
    if (metrikBalance && typeof metrikBalance === 'bigint') {
      setBalances(prev => ({
        ...prev,
        metrik: formatAmount(metrikBalance),
      }));
    }
  }, [metrikBalance]);

  useEffect(() => {
    if (usdcBalance && typeof usdcBalance === 'bigint') {
      setBalances(prev => ({
        ...prev,
        usdc: formatAmount(usdcBalance, 6), // USDC has 6 decimals
      }));
    }
  }, [usdcBalance]);

  useEffect(() => {
    if (ethBalance?.value) {
      setBalances(prev => ({
        ...prev,
        eth: ethBalance.formatted,
      }));
    }
  }, [ethBalance]);

  const getFormattedBalance = useCallback((token: 'metrik' | 'usdc' | 'eth') => {
    return balances[token];
  }, [balances]);

  return {
    balances,
    getFormattedBalance,
  };
} 