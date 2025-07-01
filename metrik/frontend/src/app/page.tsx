'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [selectedRole, setSelectedRole] = useState<'supplier' | 'lp' | 'owner' | null>(null);

  const handleRoleSelect = (role: 'supplier' | 'lp' | 'owner') => {
    setSelectedRole(role);
  };

  useEffect(() => {
    if (isConnected && selectedRole) {
      if (selectedRole === 'supplier') {
        router.push('/dashboard/supplier/staking');
      } else if (selectedRole === 'lp') {
        router.push('/dashboard/lp/deposit');
      } else if (selectedRole === 'owner') {
        router.push('/dashboard/owner');
      }
    }
  }, [isConnected, selectedRole, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Metrik Protocol
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Decentralized invoice financing and lending platform
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div className="space-y-6">
            <p className="text-gray-600">Select your role to continue</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                onClick={() => handleRoleSelect('supplier')}
                className={`group relative flex flex-col items-center p-6 bg-white border ${
                  selectedRole === 'supplier' 
                    ? 'border-indigo-500 ring-2 ring-indigo-500' 
                    : 'border-gray-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500'
                } rounded-lg transition-all`}
              >
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Supplier</h3>
                <p className="mt-2 text-sm text-gray-500">Create and manage invoices</p>
              </button>

              <button
                onClick={() => handleRoleSelect('lp')}
                className={`group relative flex flex-col items-center p-6 bg-white border ${
                  selectedRole === 'lp' 
                    ? 'border-indigo-500 ring-2 ring-indigo-500' 
                    : 'border-gray-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500'
                } rounded-lg transition-all`}
              >
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Liquidity Provider</h3>
                <p className="mt-2 text-sm text-gray-500">Provide liquidity and earn interest</p>
              </button>

              <button
                onClick={() => handleRoleSelect('owner')}
                className={`group relative flex flex-col items-center p-6 bg-white border ${
                  selectedRole === 'owner' 
                    ? 'border-indigo-500 ring-2 ring-indigo-500' 
                    : 'border-gray-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500'
                } rounded-lg transition-all`}
              >
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Contract Owner</h3>
                <p className="mt-2 text-sm text-gray-500">Verify invoices and manage protocol</p>
              </button>
            </div>

            {selectedRole && (
              <div className="space-y-4">
                <p className="text-gray-600">Now connect your wallet to continue as a {selectedRole}</p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
