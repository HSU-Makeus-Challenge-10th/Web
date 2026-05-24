import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    const cleanup = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };

    const now = Date.now();
    const timeSinceLastRan = now - lastRan.current;

    if (timeSinceLastRan >= interval) {
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      cleanup();
      timeoutId.current = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, interval - timeSinceLastRan);
    }

    return cleanup;
  }, [value, interval]);

  return throttledValue;
}
