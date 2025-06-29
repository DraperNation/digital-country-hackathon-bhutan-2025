import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import GlassCard from './GlassCard';

interface Transaction {
  id: string;
  type: 'mint' | 'burn';
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  delay?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading = false,
  delay = 0
}) => {
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-status-success';
      case 'pending':
        return 'text-status-warning';
      case 'failed':
        return 'text-status-error';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    return type === 'mint' ? (
      <ArrowDownLeft className="w-4 h-4 text-status-success" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-status-error" />
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <GlassCard delay={delay} className="col-span-full lg:col-span-1">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="flex items-center space-x-3 mb-6"
        >
          <div className="p-2 rounded-lg bg-gradient-to-r from-bhutan-gold to-bhutan-amber">
            <Activity className="w-5 h-5 text-bhutan-deep" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Recent Activity</h3>
            <p className="font-body text-gray-400 text-sm font-light">Latest transactions</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.1 * i }}
                className="animate-pulse"
              >
                <div className="flex items-center space-x-3 p-3 bg-glass-white rounded-lg">
                  <div className="w-8 h-8 bg-bhutan-royal/30 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-bhutan-royal/30 rounded w-3/4"></div>
                    <div className="h-3 bg-bhutan-royal/30 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-bhutan-royal/30 rounded w-16"></div>
                </div>
              </motion.div>
            ))
          ) : transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.4 }}
              className="text-center py-8"
            >
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="font-body text-gray-400 font-medium">No recent transactions</p>
              <p className="font-body text-gray-500 text-sm font-light">Your transaction history will appear here</p>
            </motion.div>
          ) : (
            transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 * index }}
                className="flex items-center space-x-3 p-3 bg-glass-white rounded-lg hover:bg-glass-hover transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-full bg-bhutan-navy/50">
                  {getTypeIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-sans font-medium capitalize">
                      {tx.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)} bg-current/10 font-body font-medium`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-body text-sm text-gray-400">
                    <span>{formatTime(tx.timestamp)}</span>
                    <span>•</span>
                    <span className="truncate font-mono text-xs">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono font-medium">
                    {tx.type === 'mint' ? '+' : '-'}{tx.amount.toFixed(8)}
                  </div>
                  <div className="font-body text-xs text-gray-400">
                    {tx.type === 'mint' ? 'BBT' : 'ckBTC'}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.8 }}
            className="mt-6 text-center"
          >
            <button className="text-bhutan-gold hover:text-bhutan-amber font-body font-medium text-sm transition-colors">
              View All Transactions
            </button>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
};

export default RecentTransactions;