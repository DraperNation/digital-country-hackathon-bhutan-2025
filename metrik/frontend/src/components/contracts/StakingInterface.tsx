'use client';

import { useState } from 'react';
import { useStaking } from '@/hooks/useStaking';

export function StakingInterface() {
  const {
    stake,
    unstake,
    currentTier,
    stakeDuration,
    isLoading,
    error,
    animatedStakedAmount,
    animatedRewards,
    animatedMetrikBalance,
  } = useStaking();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleStake = async () => {
    try {
      setIsStaking(true);
      await stake(amount, Number(duration));
      setAmount('');
      setDuration('30');
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    try {
      setIsUnstaking(true);
      await unstake();
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsUnstaking(false);
    }
  };

  // const handleClaimRewards = async () => {
  //   try {
  //     await claimRewards();
  //     if (address) {
  //       // No longer need to manually fetch here, useStaking handles it.
  //     }
  //   } catch (err) {
  //     // Error is handled in the hook
  //   }
  // };

  return (
    <div className="p-4">
      <h2 className="text-xl text-black font-bold mb-4">Stake METRIK Tokens</h2>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error.message}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Staking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Current Stake</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-indigo-600 transition-all duration-300">
              {animatedStakedAmount} METRIK
            </p>
            {isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-sm text-gray-500">Duration: {stakeDuration / (24 * 60 * 60)} days</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Current Tier</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-indigo-600">Tier {currentTier}</p>
            {isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-sm text-gray-500">Based on your staked amount and duration</p>
        </div>
      </div>

      {/* METRIK Balance */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900">METRIK Balance</h3>
        <div className="flex items-center">
          <p className="text-2xl font-bold text-blue-600 transition-all duration-300">
            {animatedMetrikBalance} METRIK
          </p>
          {isLoading && (
            <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>

      {/* Staking Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-2 py-3"
            placeholder="Enter amount to stake"
            disabled={isStaking || isUnstaking}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-2 py-3"
            placeholder="Enter staking duration in days"
            disabled={isStaking || isUnstaking}
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleStake}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isStaking || isUnstaking || !amount}
          >
            {isStaking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Staking...
              </>
            ) : (
              'Stake'
            )}
          </button>
          <button
            onClick={handleUnstake}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isStaking || isUnstaking}
          >
            {isUnstaking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Unstaking...
              </>
            ) : (
              'Unstake'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 