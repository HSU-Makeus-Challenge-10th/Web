// useThrottle : 주어진 상태가 자주 변경될 때
// 시간 제한을 걸어서 수많은 리렌더 방지

import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay = 500): T {
  // 1.상태 변수 : throttleValue = 최종적으로 스로틀링이 적용된 값
  // 초기값을 전달받은 value
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. Ref lastExecuted : 마지막으로 실행된 시간 기록 함수
  // useRef 사용 시 컴포넌트가 리렌더 되더라도 값이 유지 + 변경되어도 리렌더 트리거 X
  const lastExecuted = useRef<number>(Date.now());

  // 3. useEffect를 통해 value, delay 변경 시 로직 실행
  useEffect(() => {
    // 현재 시각과 마지막 시각 + delay 비교
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      // 최신 value를 throttledValue에 저장해서 컴포넌트로 리렌더링
      setThrottledValue(value);
    } else {
      // 충분한 시간이 지나지 않은 경우 -> delay 시간 후에 업데이트
      const timeId = setTimeout(() => {
        // 타이머 만료 시
        lastExecuted.current = Date.now();
        // 최신 value를 throttledValue에 저장해서 컴포넌트로 리렌더링
        setThrottledValue(value);
      }, delay);

      //Cleanup Function 이펙트가 재실행되기 전에 타이머가 실행되지 않았다면
      // 기존 타이머를 clearTimeout을 통해 중복 업뎃 방지
      return () => clearTimeout(timeId)
    }
  }, [value, delay]);

  return throttledValue
}

export default useThrottle;
