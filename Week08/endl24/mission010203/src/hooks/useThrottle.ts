import { useState, useEffect, useRef } from "react";

export function useThrottle<T>(value: T, interval: number): T {
  // 쓰로틀링이 적용된 최종 값을 저장할 상태
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // (렌더링을 유발하지 않고 값만 조용히 기억해야 하므로 useRef 사용)
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => { 
    const now = Date.now();
    const timeElapsed = now - lastExecuted.current; // 마지막 실행 후 흐른 시간

    // 이미 우리가 설정한 주기(interval)보다 많은 시간이 흘렀다면? 즉시 값을 업데이트하고 기준 시간을 '지금'으로 갱신
    if (timeElapsed >= interval) {
      setThrottledValue(value);
      lastExecuted.current = now;
    }
    // 아직 주기가 안 끝났는데 값이 또 들어왔다면 주기까지 남은 시간(interval - timeElapsed)만큼만 타이머를 걸어두고 기다림
    else {
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, interval - timeElapsed);

      // 컴포넌트가 언마운트되거나, 남은 시간 안에 value가 또 바뀌면 기존에 걸어둔 타이머를 깨끗하게 청소해서 중복 실행 방지
      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}
