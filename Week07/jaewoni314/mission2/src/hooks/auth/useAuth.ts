import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserMe } from '../../apis/auth';

export const useAuth = () => {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuthStore();

  const hasToken = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  // 기존 'hasToken() && !isLoggedIn' 조건에서 '!isLoggedIn'을 제거하여
  // invalidateQueries가 호출될 때 정상적으로 refetch가 발생하도록 수정
  const shouldFetchUser = hasToken();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getUserMe,
    enabled: shouldFetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setIsLoggedIn(true);
    } else if (isError) {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, [data, isError, setUser, setIsLoggedIn]);

  const fetchUser = async () => {
    const result = await refetch();
    return result;
  };

  const actualIsLoading = shouldFetchUser ? isLoading : false;

  return {
    user,
    isLoggedIn,
    fetchUser,
    setIsLoggedIn,
    setUser,
    isLoading: actualIsLoading
  };
};