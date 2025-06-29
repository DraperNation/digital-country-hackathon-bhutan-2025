'use client';

import { useLPDepositHistory } from '@/hooks/useLPDepositHistory';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from "react";

export function LPDepositHistory() {
  const { deposits, animatedStats, isLoading, error } = useLPDepositHistory();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isLoading && deposits.length > 0) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, deposits.length]);

  return (
    <div className="space-y-6">
      {/* LP Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
              $
            </span>
            <span className="text-xs text-gray-500 font-medium">Total Deposited</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{animatedStats.totalDeposited} <span className="text-base font-medium text-gray-500">USDC</span></span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>
            </span>
            <span className="text-xs text-gray-500 font-medium">Total Withdrawn</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{animatedStats.totalWithdrawn} <span className="text-base font-medium text-gray-500">USDC</span></span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>
            </span>
            <span className="text-xs text-gray-500 font-medium">Total Interest</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{animatedStats.totalInterest} <span className="text-base font-medium text-gray-500">USDC</span></span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>
            </span>
            <span className="text-xs text-gray-500 font-medium">Active Deposits</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{animatedStats.activeDeposits}</span>
        </div>
      </div>
      {/* Deposit History Table */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Deposit History</h3>
          <p className="text-sm text-gray-500">Track your USDC deposits, withdrawals, and earned interest.</p>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap">Deposit Amount (USDC)</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap">Deposit Date</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap">Withdrawn (USDC)</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap">Interest Earned (USDC)</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && !hasLoadedOnce ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 mx-auto"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : deposits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No deposit history found.</p>
                      </td>
                    </tr>
                  ) : (
                    deposits.map((deposit, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-mono font-medium text-gray-900 whitespace-nowrap">{deposit.amount}</td>
                        <td className="px-6 py-3 text-gray-900 whitespace-nowrap">{deposit.depositTime.toLocaleDateString()}</td>
                        <td className="px-6 py-3 font-mono text-gray-900 whitespace-nowrap">{deposit.withdrawnAmount}</td>
                        <td className="px-6 py-3 font-mono text-green-600 whitespace-nowrap">{deposit.interestAccrued}</td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deposit.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}> 
                            {deposit.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 