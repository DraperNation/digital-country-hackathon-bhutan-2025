import React, { useState, useEffect } from 'react';
import { WalletCreation } from '@/components/WalletCreation';
import { SendCoinUI } from '@/components/SendCoinUi';
import { TransactionHistory } from '@/components/TransactionHistory';
import { SmartContractTransparency } from '@/components/SmartContractTransparency';
import { Navigation } from '@/components/Navigation';
import { WalletDashboard } from '@/components/WalletDashboard';
import { MarketData } from '@/components/MarketData';
import { useWallet } from '@/context';

const Index = () => {
  const { loggedIn, address } = useWallet();
  console.log("loggedIn", loggedIn);
  const [currentWallet, setCurrentWallet] = useState<string | undefined>();

  useEffect(() => {
    // Check if user is already logged in
    const savedWallet = localStorage.getItem('btnx-current-wallet');
    if (savedWallet) {
      setCurrentWallet(savedWallet);
    }
  }, []);

  const handleLogin = (walletAddress: string) => {
    setCurrentWallet(walletAddress);

    localStorage.setItem('btnx-current-wallet', walletAddress);
  };

  const handleLogout = () => {
    setCurrentWallet(undefined);
    localStorage.removeItem('btnx-current-wallet');
  };

  const handleWalletCreated = (walletAddress: string) => {
    // Automatically login after wallet creation
    handleLogin(walletAddress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      <Navigation
        isLoggedIn={loggedIn}
        currentWallet={currentWallet}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {loggedIn ? (
          // Show wallet dashboard when logged in
          <div>
            {/* Market Data Display */}
            <MarketData />
            
            {/* SendCoinUI and TransactionHistory stacked vertically */}
            <div className="space-y-8">
              <SendCoinUI address={address} />
              <TransactionHistory address={address} />
            </div>
          </div>
        ) : (
          // Show public information when not logged in
          <>
            {/* Hero Section */}
            <div className="text-center py-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent mb-4">
                Bhutan Bitcoin Currency (BTNX)
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                The world's first sovereign Bitcoin-backed digital currency with transparent reserves,
                multi-signature security, and global interoperability.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-orange-800 font-medium">
                  🔐 Please connect wallet to send transactions across
                </p>
              </div>
            </div>




          </>
        )}
        <div className="grid grid-cols-1 gap-8">
          <SmartContractTransparency />
        </div>

        {/* Wallet Creation - Only show when logged in */}

      </main>
    </div>
  );
};

export default Index;
