
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bitcoin, Shield, Users } from 'lucide-react';
import { SendReceive } from './SendReceive';

interface WalletDashboardProps {
  walletAddress: string;
}

export const WalletDashboard = ({ walletAddress }: WalletDashboardProps) => {
  // Mock wallet data - in a real app, this would come from the blockchain
  const walletData = {
    balance: '125,450.75',
    btcBacking: '2.456',
    pendingTransactions: 3,
    signers: 5,
    requiredSignatures: 3
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your BTNX Wallet</h2>
        <p className="text-gray-600">Address: {walletAddress}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">BTNX Balance</h3>
            <Bitcoin className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{walletData.balance}</p>
          <p className="text-sm text-gray-500 mt-1">≈ {walletData.btcBacking} BTC backing</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Multi-Sig Status</h3>
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{walletData.requiredSignatures}/{walletData.signers}</p>
          <p className="text-sm text-gray-500 mt-1">Required signatures</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending</h3>
            <Users className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{walletData.pendingTransactions}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
        </Card>
      </div>

      <SendReceive walletAddress={walletAddress} />
    </div>
  );
};
