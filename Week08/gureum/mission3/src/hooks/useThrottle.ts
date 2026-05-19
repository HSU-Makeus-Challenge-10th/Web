import { useCallback, useEffect, useRef } from 'react';

export const useThrottle = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  interval = 1000,
) => {
  const isThrottledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      isThrottledRef.current = false;
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: TArgs) => {
      if (isThrottledRef.current) return;

      callback(...args);
      isThrottledRef.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        isThrottledRef.current = false;
        timerRef.current = null;
      }, interval);
    },
    [callback, interval],
  );

  return throttledCallback;
};
