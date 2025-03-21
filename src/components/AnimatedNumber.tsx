
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const AnimatedNumber = ({
  value,
  duration = 1000,
  formatValue = (val: number) => val.toFixed(2),
  className
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    
    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValue + progress * (value - startValue);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        window.requestAnimationFrame(animateValue);
      }
    };
    
    window.requestAnimationFrame(animateValue);
  }, [value, duration, displayValue]);
  
  return (
    <span className={cn("transition-all duration-200", className)}>
      {formatValue(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
