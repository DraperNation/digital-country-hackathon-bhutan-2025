'use client';

import { useBalance, useAccount } from 'wagmi';
import { sepolia } from '@reown/appkit/networks';

export default function BTNXBalance() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading, error } = useBalance({
    address: address,
    token: '0x6f2548B040278E3B65C0158BfD38371e7e9c6712', // BTNX contract address
    chainId: sepolia.id, // Sepolia chain ID
  });

  if (!isConnected) {
    return <div>Please connect your wallet to view BTNX balance.</div>;
  }

  if (isLoading) {
    return <div>Loading BTNX balance...</div>;
  }

  if (error) {
    return <div>Error fetching BTNX balance: {error.message}</div>;
  }

  return (
    <div>
      <h3>BTNX Balance</h3>
      <p>
        {balance ? `${balance.formatted} ${balance.symbol}` : '0 BTNX'}
      </p>
    </div>
  );
}