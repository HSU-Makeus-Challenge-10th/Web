import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/key';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { RequestSigninDto, UserInfo } from '../types/auth';
import { postLogout, postSignin, getMyInfo } from '../apis/auth';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  login: (credentials: RequestSigninDto) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  login: async () => false,
  logout: async () => {},
  fetchUserInfo: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    getItem: getAccessToken,
    setItem: setAccessToken,
    removeItem: removeAccessToken,
  } = useLocalStorage(LOCAL_STORAGE_KEYS.accessToken);

  const {
    getItem: getRefreshToken,
    setItem: setRefreshToken,
    removeItem: removeRefreshToken,
  } = useLocalStorage(LOCAL_STORAGE_KEYS.refreshToken);

  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(getRefreshToken);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // accessToken이 생기면 사용자 정보 자동 조회
  useEffect(() => {
    if (accessToken && !userInfo) {
      void fetchUserInfo();
    }
  }, [accessToken]);

  // 다른 탭의 storage 변경 동기화
  useEffect(() => {
    const handleStorage = () => {
      setAccessTokenState(getAccessToken());
      setRefreshTokenState(getRefreshToken());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchUserInfo = async (): Promise<void> => {
    try {
      if (!accessToken) return;
      const { data } = await getMyInfo();
      setUserInfo(data);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  };

  const login = async (credentials: RequestSigninDto): Promise<boolean> => {
    try {
      const response = await postSignin(credentials);
      const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      setAccessTokenState(newAccess);
      setRefreshTokenState(newRefresh);

      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await postLogout();
    } catch {
      // 서버 오류와 무관하게 로컬 상태는 항상 초기화
    } finally {
      removeAccessToken();
      removeRefreshToken();
      setAccessTokenState(null);
      setRefreshTokenState(null);
      setUserInfo(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, userInfo, login, logout, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
