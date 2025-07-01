import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0 
}) => {
  return (
    <motion.div 
      className={`
        relative overflow-hidden rounded-2xl
        bg-glass-white backdrop-blur-xl
        border border-glass-border
        shadow-bhutan
        ${hover ? 'hover:shadow-gold hover:border-bhutan-gold/30' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: "easeOut"
      }}
      whileHover={hover ? { 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Enhanced glass effect overlay with Bhutan colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-bhutan-gold/10 via-bhutan-gold/5 to-transparent pointer-events-none" />
      
      {/* Subtle inner border with gold tint */}
      <div className="absolute inset-0 rounded-2xl border border-bhutan-gold/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Enhanced glow effect with Bhutan colors */}
      <div className="absolute -inset-1 bg-gradient-to-r from-bhutan-gold/20 via-bhutan-amber/20 to-bhutan-saffron/20 rounded-2xl blur-sm opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      {/* Ambient light reflection with gold shimmer */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bhutan-gold/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 3,
          delay: delay + 1,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default GlassCard;