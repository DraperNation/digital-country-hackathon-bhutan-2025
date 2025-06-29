import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from './GlassCard';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  suffix?: string;
  loading?: boolean;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  suffix = '',
  loading = false,
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = typeof value === 'number' ? value : parseFloat(value.toString()) || 0;

  useEffect(() => {
    if (loading) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      setDisplayValue(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue, loading]);

  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-status-success" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-status-error" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-status-success';
      case 'negative':
        return 'text-status-error';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <GlassCard delay={delay}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-body text-sm font-medium text-gray-300 uppercase tracking-wider">
            {title}
          </h3>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`font-mono text-sm font-medium ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-bhutan-royal/30 rounded w-3/4"></div>
            </div>
          ) : (
            <motion.div
              className="font-mono text-3xl font-bold text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {typeof value === 'number' 
                ? displayValue.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8 
                  })
                : value
              }
              {suffix && (
                <span className="font-body text-lg text-bhutan-gold ml-2 font-medium">{suffix}</span>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default MetricCard;