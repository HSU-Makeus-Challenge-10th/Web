import { useCallback, useEffect, useRef } from 'react';

interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export const useThrottle = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  interval = 1000,
  options: ThrottleOptions = {},
) => {
  const { leading = true, trailing = false } = options;

  const isThrottledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailingArgsRef = useRef<TArgs | null>(null);

  const clearTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimer();
      isThrottledRef.current = false;
      trailingArgsRef.current = null;
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: TArgs) => {
      const releaseOrFlush = () => {
        if (trailing && trailingArgsRef.current) {
          const nextArgs = trailingArgsRef.current;
          trailingArgsRef.current = null;
          callback(...nextArgs);
          timerRef.current = setTimeout(releaseOrFlush, interval);
          return;
        }

        isThrottledRef.current = false;
        timerRef.current = null;
      };

      if (isThrottledRef.current) {
        if (trailing) trailingArgsRef.current = args;
        return;
      }

      if (leading) callback(...args);
      else if (trailing) trailingArgsRef.current = args;

      isThrottledRef.current = true;
      clearTimer();
      timerRef.current = setTimeout(releaseOrFlush, interval);
    },
    [callback, interval, leading, trailing],
  );

  return throttledCallback;
};
