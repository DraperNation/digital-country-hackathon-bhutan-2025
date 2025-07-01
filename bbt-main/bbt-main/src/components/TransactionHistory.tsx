import React, { useState, useEffect } from 'react';
import { TransactionHistory as TransactionHistoryType } from '../lib/web3-service';
import web3Service from '../lib/web3-service';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTransactions = () => {
      const history = web3Service.getTransactionHistory();
      setTransactions(history);
    };

    // Load initial transactions
    loadTransactions();

    // Set up interval to refresh transactions
    const interval = setInterval(loadTransactions, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return '🟢';
      case 'burn':
        return '🔴';
      case 'faucet':
        return '🚰';
      default:
        return '📝';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    if (type === 'faucet' && amount === 0) return 'Pending...';
    return `${amount.toFixed(2)} ${type === 'faucet' ? 'BBT' : 'BBT'}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getExplorerUrl = (hash: string) => {
    return `https://testnet.snowtrace.io/tx/${hash}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Transaction History
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">No transactions yet</div>
          <div className="text-gray-500 text-sm">
            Your transaction history will appear here once you start minting, burning, or using the faucet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Transaction History
        <span className="ml-2 text-sm text-gray-400">
          ({transactions.length} transactions)
        </span>
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((tx, index) => (
          <div
            key={tx.hash}
            className="bg-black/20 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(tx.type)}</span>
                <span className="font-semibold text-white capitalize">
                  {tx.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {formatTimestamp(tx.timestamp)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Amount:</span>
                <span className="ml-2 text-white font-medium">
                  {formatAmount(tx.amount, tx.type)}
                </span>
              </div>
              
              {tx.blockNumber && (
                <div>
                  <span className="text-gray-400">Block:</span>
                  <span className="ml-2 text-white font-mono">
                    #{tx.blockNumber}
                  </span>
                </div>
              )}
              
              {tx.gasUsed && (
                <div>
                  <span className="text-gray-400">Gas Used:</span>
                  <span className="ml-2 text-white font-mono">
                    {tx.gasUsed.toLocaleString()}
                  </span>
                </div>
              )}
              
              {tx.fee && (
                <div>
                  <span className="text-gray-400">Fee:</span>
                  <span className="ml-2 text-white font-mono">
                    {tx.fee.toFixed(6)} AVAX
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-xs">Hash:</span>
                  <span className="text-white font-mono text-xs">
                    {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(tx.hash)}
                    className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                  >
                    Copy
                  </button>
                  <a
                    href={getExplorerUrl(tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 