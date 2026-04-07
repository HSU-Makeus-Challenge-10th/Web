import { useState, useCallback } from 'react';

/**
 * useLocalStorage 커스텀 훅
 * @param key 로컬 스토리지 키
 * @param initialValue 로컬 스토리지에 데이터가 없을 경우 사용할 초기값
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬 스토리지에 데이터가 존재하면 가져오기
  const getStoredValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`로컬 스토리지 키 "${key}" 읽기 오류:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 상태와 로컬 스토리지를 동시에 업데이트
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`로컬 스토리지 키 "${key}" 설정 오류:`, error);
      }
    },
    [key, storedValue]
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
