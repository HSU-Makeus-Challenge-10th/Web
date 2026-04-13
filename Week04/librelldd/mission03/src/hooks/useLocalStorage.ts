export const useLocalStorage = (key: string) => {
  // 데이터 저장
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  // 데이터 가져오기
  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };


  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem, removeItem };
};