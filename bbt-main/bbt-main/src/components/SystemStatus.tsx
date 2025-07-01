import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Activity } from 'lucide-react';
import GlassCard from './GlassCard';

interface SystemStatusProps {
  collateralizationRatio: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  btcPrice: number;
  delay?: number;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  collateralizationRatio,
  systemHealth,
  btcPrice,
  delay = 0
}) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-status-success';
      case 'warning':
        return 'text-status-warning';
      case 'critical':
        return 'text-status-error';
      default:
        return 'text-gray-400';
    }
  };

  const getHealthBg = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'from-status-success/20 to-bhutan-gold/20';
      case 'warning':
        return 'from-status-warning/20 to-bhutan-saffron/20';
      case 'critical':
        return 'from-status-error/20 to-bhutan-crimson/20';
      default:
        return 'from-gray-500/20 to-gray-600/20';
    }
  };

  return (
    <GlassCard delay={delay}>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="flex items-center space-x-3 mb-6"
        >
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getHealthBg(systemHealth)}`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">System Status</h3>
            <p className="font-body text-gray-400 text-sm font-light">Protocol health metrics</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="font-body text-gray-300 font-medium">System Health</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth).replace('text-', 'bg-')} animate-pulse`}></div>
              <span className={`font-sans font-medium capitalize ${getHealthColor(systemHealth)}`}>
                {systemHealth}
              </span>
            </div>
          </motion.div>

          {/* Collateralization Ratio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.6 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="font-body text-gray-300 font-medium">Collateralization</span>
              </div>
              <span className="text-white font-mono font-medium">
                {collateralizationRatio.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-bhutan-navy rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-bhutan-gold to-bhutan-amber"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(collateralizationRatio, 100)}%` }}
                transition={{ duration: 1, delay: delay + 0.8 }}
              />
            </div>
          </motion.div>

          {/* BTC Price */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.8 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="font-body text-gray-300 font-medium">BTC Price</span>
            </div>
            <span className="text-white font-mono font-medium">
              ${btcPrice.toLocaleString()}
            </span>
          </motion.div>

          {/* Network Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 1.0 }}
            className="pt-4 border-t border-glass-border"
          >
            <div className="grid grid-cols-2 gap-4 font-body text-sm">
              <div className="text-center">
                <p className="text-gray-400 font-light">Network</p>
                <p className="text-status-success font-medium">IC Mainnet</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-light">Uptime</p>
                <p className="text-status-success font-medium">99.99%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SystemStatus;