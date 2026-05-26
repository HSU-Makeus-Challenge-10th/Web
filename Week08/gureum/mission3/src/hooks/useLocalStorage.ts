export function useLocalStorage(key: string) {
  const getItem = (): string | null => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return typeof parsed === 'string' ? parsed : raw;
    } catch {
      return localStorage.getItem(key);
    }
  };

  const setItem = (value: string): void => {
    localStorage.setItem(key, value);
  };

  const removeItem = (): void => {
    localStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
}
