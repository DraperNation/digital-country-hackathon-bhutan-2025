'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useLendingPool } from '@/hooks/useLendingPool';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { formatUnits } from 'viem';

export function LendingInterface() {
  const { address } = useAccount();
  const {
    repay,
    deposit,
    withdraw,
    withdrawInterest,
    getLPInterest,
    borrowedAmount,
    availableLiquidity,
    isLoading,
    error,
  } = useLendingPool();
  const { getFormattedBalance } = useTokenBalance();

  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [lpInterest, setLpInterest] = useState<bigint>(BigInt(0));
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWithdrawingInterest, setIsWithdrawingInterest] = useState(false);

  const fetchLPInterest = useCallback(async () => {
    if (address && getLPInterest) {
      try {
        const interest = await getLPInterest(address) 
        setLpInterest(interest);
      } catch (err) {
        console.error('Error fetching LP interest:', err);
        setLpInterest(BigInt(0));
      }
    }
  }, [address, getLPInterest]);

  useEffect(() => {
    fetchLPInterest();
  }, [fetchLPInterest]);

  const handleAction = async () => {
    setIsProcessing(true);
    try {
      if (action === 'deposit') {
        await deposit(amount);
      } else if (action === 'withdraw') {
        await withdraw(amount);
      }
      setAmount('');
      fetchLPInterest();
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawInterest = async () => {
    setIsWithdrawingInterest(true);
    try {
      await withdrawInterest();
      fetchLPInterest();
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsWithdrawingInterest(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl text-black font-bold mb-4">Lending Pool</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Your USDC Balance</h3>
            <p className="text-2xl text-black font-bold">{getFormattedBalance('usdc')} USDC</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Available Liquidity</h3>
            <p className="text-2xl text-black font-bold">{availableLiquidity} USDC</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Earned Interest</h3>
            <p className="text-2xl text-black font-bold">{formatUnits(lpInterest, 6)} USDC</p>
            <button
              onClick={handleWithdrawInterest}
              disabled={isWithdrawingInterest || lpInterest === BigInt(0)}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isWithdrawingInterest ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Withdrawing...
                </>
              ) : (
                'Withdraw Interest'
              )}
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setAction('deposit')}
            className={`flex-1 py-2 px-4 rounded-md ${
              action === 'deposit'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setAction('withdraw')}
            className={`flex-1 py-2 px-4 rounded-md ${
              action === 'withdraw'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Withdraw
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-3 text-black"
            placeholder={`Enter amount to ${action}`}
          />
        </div>
        <button
          onClick={handleAction}
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
          disabled={isProcessing || !amount}
        >
          {isProcessing ? 'Processing...' : action.charAt(0).toUpperCase() + action.slice(1)}
        </button>
        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
} 