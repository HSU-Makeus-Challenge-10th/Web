import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // 지연된 값을 저장할 상태
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 추가 입력 있으면 클린업 
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}