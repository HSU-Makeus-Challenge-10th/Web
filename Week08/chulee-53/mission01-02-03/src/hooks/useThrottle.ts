import { useEffect, useRef, useState } from "react";

export default function useThrottle<T>(value: T, interval = 3000): T {
   const [throttledValue, setThrottledValue] = useState<T>(value);
   const lastExecuted = useRef<number>(Date.now());

   useEffect(() => {
    // boolean 값일 때 false는 즉시 반영 (무한 스크롤 무한 요청 버그 방지)
    if (typeof value === 'boolean' && value === false) {
        setThrottledValue(value);
        return;
    }

    if(Date.now() >= lastExecuted.current + interval) {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
    } else {
        const timerId = setTimeout(() => {
            lastExecuted.current = Date.now();
            setThrottledValue(value);
        }, interval)

        return () => clearTimeout(timerId)
    }
   }, [value, interval])

   return throttledValue;
}