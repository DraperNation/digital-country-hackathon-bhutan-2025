import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from './GlassCard';

interface SystemHealthProps {
  collateralizationRatio: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  btcPrice: number;
  isPaused: boolean;
  delay?: number;
}

const SystemHealth: React.FC<SystemHealthProps> = ({
  collateralizationRatio,
  systemHealth,
  btcPrice,
  isPaused,
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

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-status-warning" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-status-error" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCollateralColor = (ratio: number) => {
    if (ratio >= 150) return 'text-status-success';
    if (ratio >= 120) return 'text-status-warning';
    return 'text-status-error';
  };

  const getCollateralBg = (ratio: number) => {
    if (ratio >= 150) return 'bg-status-success';
    if (ratio >= 120) return 'bg-status-warning';
    return 'bg-status-error';
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
            {getHealthIcon(systemHealth)}
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

          {/* Emergency Mode Status */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.5 }}
              className="p-3 bg-status-error/10 border border-status-error/20 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-status-error" />
                <span className="font-body text-status-error font-medium text-sm">
                  Emergency Mode Active - All transactions paused
                </span>
              </div>
            </motion.div>
          )}

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
              <span className={`font-mono font-medium ${getCollateralColor(collateralizationRatio)}`}>
                {collateralizationRatio.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-bhutan-navy rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getCollateralBg(collateralizationRatio)}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(collateralizationRatio / 2, 100)}%` }}
                transition={{ duration: 1, delay: delay + 0.8 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-body">
              <span>Critical: 100%</span>
              <span>Warning: 120%</span>
              <span>Healthy: 150%+</span>
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
                <p className="text-gray-400 font-light">Status</p>
                <p className={`font-medium ${isPaused ? 'text-status-error' : 'text-status-success'}`}>
                  {isPaused ? 'Paused' : 'Active'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SystemHealth;