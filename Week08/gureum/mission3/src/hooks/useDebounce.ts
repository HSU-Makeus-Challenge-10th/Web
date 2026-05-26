import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delay = 300) => {
  // 마지막으로 확정된 값(= delay 동안 변경이 멈춘 값)
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // value가 바뀔 때마다 타이머를 다시 건다.
    // 연속 입력에서는 이전 타이머를 취소해 마지막 값만 반영한다.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      // 디바운스 핵심: 이전 예약 실행 취소
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
