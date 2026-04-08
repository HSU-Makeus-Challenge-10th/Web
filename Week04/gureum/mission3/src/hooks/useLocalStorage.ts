export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = <T>() => {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  };

  const removeItem = () => {
    window.localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
