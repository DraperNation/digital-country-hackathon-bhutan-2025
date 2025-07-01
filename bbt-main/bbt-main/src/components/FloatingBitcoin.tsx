import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin } from 'lucide-react';

interface FloatingBitcoinProps {
  size?: number;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

const FloatingBitcoin: React.FC<FloatingBitcoinProps> = ({ 
  size = 40, 
  delay = 0, 
  duration = 8,
  x = 0,
  y = 0 
}) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0.8, 0],
        scale: [0, 1, 1, 0],
        y: [0, -30, -60, -100],
        x: [0, 15, -15, 0],
        rotate: [0, 180, 360, 540]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-bitcoin-orange/30 blur-xl scale-150 animate-pulse"></div>
        
        {/* Middle glow */}
        <div className="absolute inset-0 rounded-full bg-bitcoin-orange/50 blur-lg scale-125"></div>
        
        {/* Bitcoin icon with enhanced styling */}
        <div className="relative">
          <Bitcoin 
            size={size} 
            className="text-bitcoin-orange drop-shadow-2xl filter relative z-10" 
            style={{
              filter: 'drop-shadow(0 0 20px rgba(247, 147, 26, 0.8))'
            }}
          />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-bitcoin-orange/20 blur-md"></div>
        </div>
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: delay + 1,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-orange-300 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: delay + 2,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      </div>
    </motion.div>
  );
};

export default FloatingBitcoin;