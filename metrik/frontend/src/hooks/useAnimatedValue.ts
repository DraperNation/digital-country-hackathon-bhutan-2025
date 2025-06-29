import { useState, useEffect, useRef } from 'react';

export function useAnimatedValue(
  targetValue: string | number,
  duration: number = 1000,
  easing: 'linear' | 'ease-out' | 'ease-in-out' = 'ease-out'
) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const targetNum = typeof targetValue === 'string' ? parseFloat(targetValue) || 0 : targetValue;
    const currentNum = typeof displayValue === 'string' ? parseFloat(displayValue) || 0 : displayValue;

    // If the value hasn't changed, don't animate
    if (Math.abs(targetNum - currentNum) < 0.001) {
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startValueRef.current = currentNum;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      let easedProgress = progress;
      switch (easing) {
        case 'ease-out':
          easedProgress = 1 - Math.pow(1 - progress, 3);
          break;
        case 'ease-in-out':
          easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
        case 'linear':
        default:
          easedProgress = progress;
      }

      const newValue = startValueRef.current + (targetNum - startValueRef.current) * easedProgress;
      
      // Format the value to maintain the same precision as the target
      const targetStr = targetValue.toString();
      const decimalPlaces = targetStr.includes('.') 
        ? targetStr.split('.')[1].length 
        : 0;
      
      const formattedValue = decimalPlaces > 0 
        ? newValue.toFixed(decimalPlaces)
        : Math.round(newValue).toString();

      setDisplayValue(formattedValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, easing]);

  return displayValue;
} 