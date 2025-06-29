import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Bitcoin, TrendingUp, Eye, EyeOff, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';

interface BalanceCardProps {
  bbtBalance: number;
  reserveBalance: number;
  totalValueUSD: number;
  loading?: boolean;
  delay?: number;
  onRefresh?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  bbtBalance,
  reserveBalance,
  totalValueUSD,
  loading = false,
  delay = 0,
  onRefresh
}) => {
  const [showBalance, setShowBalance] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const formatBalance = (balance: number) => {
    return showBalance ? balance.toFixed(8) : '••••••••';
  };

  const formatUSD = (value: number) => {
    return showBalance ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$••••••';
  };

  const handleRefresh = async () => {
    if (onRefresh && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  return (
    <GlassCard delay={delay} className="col-span-full lg:col-span-2">
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-bhutan-gold to-bhutan-amber shadow-gold">
              <Wallet className="w-8 h-8 text-bhutan-deep" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Portfolio Balance</h2>
              <p className="font-body text-gray-400 font-light">Your BBT and WAVAX holdings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-glass-white hover:bg-glass-hover transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-lg bg-glass-white hover:bg-glass-hover transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-gray-300" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-bhutan-gold to-bhutan-amber"></div>
              <span className="font-sans text-gray-300 font-medium">BBT</span>
              <span className="text-xs text-gray-500 font-body">(Bhutan Bitcoin Token)</span>
            </div>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-bhutan-royal/30 rounded w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-mono text-3xl font-bold text-white">
                  {formatBalance(bbtBalance)}
                </div>
                <div className="font-body text-sm text-gray-400 font-light">
                  ≈ {formatUSD(bbtBalance * 65000)}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <Bitcoin className="w-5 h-5 text-bitcoin-orange" />
              <span className="font-sans text-gray-300 font-medium">WAVAX</span>
              <span className="text-xs text-gray-500 font-body">(Wrapped AVAX)</span>
            </div>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-bhutan-royal/30 rounded w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-mono text-3xl font-bold text-white">
                  {formatBalance(reserveBalance)}
                </div>
                <div className="font-body text-sm text-gray-400 font-light">
                  ≈ {formatUSD(reserveBalance * 35)} {/* Approximate AVAX price */}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.8 }}
          className="border-t border-glass-border pt-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-gray-400 text-sm font-light">Total Portfolio Value</p>
              <p className="font-mono text-4xl font-bold text-white">
                {formatUSD(totalValueUSD)}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-status-success">
              <TrendingUp className="w-5 h-5" />
              <span className="font-mono font-medium">+12.34%</span>
            </div>
          </div>
          
          {/* Balance Ratio */}
          <div className="mt-4 p-4 bg-bhutan-navy/30 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-gray-400 text-sm">BBT : WAVAX Ratio</span>
              <span className="font-mono text-white text-sm">
                {(bbtBalance / (reserveBalance || 1)).toFixed(2)} : 1
              </span>
            </div>
            <div className="w-full bg-bhutan-deep rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-bhutan-gold to-bhutan-amber rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((bbtBalance / (bbtBalance + reserveBalance)) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
};

export default BalanceCard;