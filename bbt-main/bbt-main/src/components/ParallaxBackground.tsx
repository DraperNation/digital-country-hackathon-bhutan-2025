import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Different parallax speeds for layers
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -600]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Base mountain background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          y: y3
        }}
      />
      
      {/* Overlay gradient for depth */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"
        style={{ y: y2 }}
      />
      
      {/* Foreground mountain silhouette */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          y: y1
        }}
      />
      
      {/* Atmospheric particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Cozy warm glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-orange-900/30 via-yellow-900/20 to-transparent" />
      
      {/* Cool mountain mist at top */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent" />
    </div>
  );
};

export default ParallaxBackground;