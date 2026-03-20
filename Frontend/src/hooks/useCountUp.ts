import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
}

export const useCountUp = (
  endValue: number,
  options: UseCountUpOptions = {}
): { value: number; start: () => void } => {
  const { duration = 1200, startOnMount = true } = options;
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  const animate = (currentTime: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentValue = Math.floor(easedProgress * endValue);

    setValue(currentValue);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setValue(endValue);
    }
  };

  const start = () => {
    startTimeRef.current = null;
    setValue(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (startOnMount && endValue > 0) {
      start();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [endValue, startOnMount]);

  return { value, start };
};

export default useCountUp;
