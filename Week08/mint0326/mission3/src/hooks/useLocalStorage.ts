import { useState, useCallback } from 'react';

/**
 * useLocalStorage 커스텀 훅
 * @param key 로컬 스토리지 키
 * @param initialValue 로컬 스토리지에 데이터가 없을 경우 사용할 초기값
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬 스토리지에 데이터가 존재하면 가져오기
  const getStoredValue = useCallback(() => {
    const item = window.localStorage.getItem(key);
    if (!item) return initialValue;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      // JSON 형식이 아닌 경우(일반 문자열 등) 원본을 반환하거나 초기값을 반환
      // 타입 T가 string인 경우 raw string으로 간주
      if (typeof initialValue === 'string' || item === 'undefined') {
        return item as unknown as T;
      }
      console.warn(`로컬 스토리지 키 "${key}" 파싱 오류 (초기값 사용):`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 상태와 로컬 스토리지를 동시에 업데이트
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.warn(`로컬 스토리지 키 "${key}" 설정 오류:`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`로컬 스토리지 키 "${key}" 삭제 오류:`, error);
    }
  }, [key, initialValue]);


  return [storedValue, setValue, removeValue] as const;
}

export default useLocalStorage;
