"use client";

import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface AnimatedBackgroundProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  mouseRadius?: number;
  mouseForce?: number;
}

export function AnimatedBackground({ 
  className = "", 
  particleCount = 60, // Reduced from 150
  colors = ['#a60d0d', '#d9b300', '#666666'],
  mouseRadius = 80, // Reduced interaction radius
  mouseForce = 0.2 // Reduced force
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const initializeParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    const gridCols = Math.floor(width / 80); // Larger spacing
    const gridRows = Math.floor(height / 80);
    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;

    for (let i = 0; i < gridCols; i++) {
      for (let j = 0; j < gridRows; j++) {
        const x = (i + 0.5) * cellWidth + (Math.random() - 0.5) * 20;
        const y = (j + 0.5) * cellHeight + (Math.random() - 0.5) * 20;
        
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    // Add some random particles for organic feel
    for (let i = 0; i < particleCount - particles.length; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originalX: Math.random() * width,
        originalY: Math.random() * height,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    particlesRef.current = particles;
  };

  // Update particle positions
  const updateParticles = () => {
    const mouse = mouseRef.current;
    
    particlesRef.current.forEach(particle => {
      // Calculate distance to mouse
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Mouse interaction
      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * mouseForce;
        particle.vy += Math.sin(angle) * force * mouseForce;
      }

      // Return to original position
      const returnForce = 0.02;
      particle.vx += (particle.originalX - particle.x) * returnForce;
      particle.vy += (particle.originalY - particle.y) * returnForce;

      // Apply friction
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Subtle floating animation
      particle.y += Math.sin(Date.now() * 0.001 + particle.originalX * 0.01) * 0.1;
    });
  };

  // Draw particles and connections
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between nearby particles
    ctx.globalCompositeOperation = 'source-over';
    particlesRef.current.forEach((particle, i) => {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const other = particlesRef.current[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (120 - distance) / 120 * 0.1;
          ctx.strokeStyle = `rgba(166, 13, 13, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.globalCompositeOperation = 'source-over';
      
      // Main particle
      ctx.fillStyle = particle.color.includes('#') 
        ? `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
        : `rgba(${particle.color}, ${particle.opacity})`;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      const mouse = mouseRef.current;
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius) {
        const glowIntensity = (mouseRadius - distance) / mouseRadius * 0.3;
        ctx.globalCompositeOperation = 'lighter';
        
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(217, 179, 0, ${glowIntensity})`);
        gradient.addColorStop(1, 'rgba(217, 179, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  // Animation loop
  const animate = (currentTime: number) => {
    // Limit to 30 FPS for better performance
    if (currentTime - lastFrameTime.current < 33) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime.current = currentTime;
    
    updateParticles();
    draw();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { innerWidth, innerHeight } = window;
    setDimensions({ width: innerWidth, height: innerHeight });
    
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    
    initializeParticles(innerWidth, innerHeight);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        width: dimensions.width,
        height: dimensions.height,
        zIndex: 0
      }}
    />
  );
}