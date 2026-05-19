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

  // 토큰이 있고 아직 로그인 상태가 아닐 때만 사용자 정보 조회
  const shouldFetchUser = hasToken() && !isLoggedIn;

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

  // 토큰이 없으면 즉시 로딩 완료로 처리 (API 호출하지 않음)
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
