export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    // 문자열 토큰은 raw 형태로 저장해 Bearer 헤더에 바로 쓸 수 있게 유지
    if (typeof value === 'string') {
      window.localStorage.setItem(key, value);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = <T>() => {
    const item = window.localStorage.getItem(key);
    if (!item) return null;

    // JSON 형식이면 파싱, 아니면 raw 문자열 반환
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  };

  const removeItem = () => {
    window.localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
