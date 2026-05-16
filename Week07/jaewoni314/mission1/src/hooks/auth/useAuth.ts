import { PrivateAPI } from '../../apis/axios';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState, useCallback } from 'react';

let isFetching = false; //후속 중복 요청 방지

export const useAuth = () => {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (isFetching) return;

    isFetching = true;
    setIsLoading(true);
    try {
      const response = await PrivateAPI.get('/users/me');
      if (response.data.status) {
        setUser(response.data.data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
      isFetching = false;
    }
  }, [setUser, setIsLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isLoggedIn) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, fetchUser]);
  return { user, isLoggedIn, fetchUser, setIsLoggedIn, setUser, isLoading };
};
