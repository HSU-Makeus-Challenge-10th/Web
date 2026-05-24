import { useRef, useEffect, useCallback } from 'react';

export const useThrottle = <T extends (...args: any[]) => any>(
    callback: T,
    interval: number
): T => {
    const lastExecuted = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        const timeSinceLast = now - lastExecuted.current;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (timeSinceLast >= interval) {
            callbackRef.current(...args);
            lastExecuted.current = now;
        } else {
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
                lastExecuted.current = Date.now();
                timeoutRef.current = null;
            }, interval - timeSinceLast);
        }
    }, [interval]) as T;
};

