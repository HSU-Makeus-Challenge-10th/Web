import { useEffect, useRef, useState } from "react";

export default function useThrottle<T>(value: T, interval = 3000): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now() - interval);

  useEffect(() => {
    if (typeof value === "boolean" && value === false) {
      setThrottledValue(value);
      return;
    }

    const elapsed = Date.now() - lastExecuted.current;

    if (elapsed >= interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const remaining = interval - elapsed;
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}
