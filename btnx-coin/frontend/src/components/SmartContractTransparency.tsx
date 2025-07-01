import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Code,
  ExternalLink,
  GitBranch,
  Lock
} from 'lucide-react';

interface Transfer {
  txHash: string;
  sender: string;
  receiver: string;
  amount: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export const SmartContractTransparency = () => {
  const [transactions, setTransactions] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await fetch('http://localhost:4000/transfers');
        const data = await res.json();

        const formatted = data.map((tx: any) => ({
          txHash: tx.txHash || tx._id,
          sender: tx.sender,
          receiver: tx.receiver,
          amount: `${parseFloat(tx.amount) / 1e18} BTNX`,
          status: tx.status || 'completed',
          timestamp: new Date(tx.timestamp).toLocaleString()
        }));

        setTransactions(formatted);
      } catch (err) {
        console.error('Error fetching transfers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[status as keyof typeof variants] || variants.failed;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Lock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-purple-200 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Code className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Public Transactions
        </CardTitle>
        <CardDescription className="text-gray-600">
          All on-chain movements of BTNX recorded with full visibility
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No transactions found.</p>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tx.status)}
                  <span className="font-medium text-gray-900">Transfer</span>
                  <Badge className={getStatusBadge(tx.status)}>{tx.status}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{tx.amount}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-2 mb-3">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-gray-700 font-mono">{tx.txHash}</code>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 text-gray-500 hover:text-purple-600" />
                  </a>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                <strong>From:</strong> {tx.sender}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>To:</strong> {tx.receiver}
              </div>

              <div className="text-sm text-gray-500">Timestamp: {tx.timestamp}</div>
            </div>
          ))
        )}

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <GitBranch className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-800">Immutable Records</span>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Each transfer is cryptographically verified on-chain. Trustless, transparent and verifiable by anyone.
          </p>
          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
            View Full History →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
