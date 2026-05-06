import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/key';
import type { UserInfo } from '../types/auth';

interface AuthContextType {
  accessToken: string | null;
  userInfo: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  userInfo: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken)
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.userInfo);
      return raw ? (JSON.parse(raw) as UserInfo) : null;
    } catch {
      return null;
    }
  });

  const login = (token: string, user: UserInfo) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.userInfo, JSON.stringify(user));
    setAccessToken(token);
    setUserInfo(user);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.userInfo);
    setAccessToken(null);
    setUserInfo(null);
  };

  // 다른 탭의 storage 변경 동기화
  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
      setAccessToken(token);
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.userInfo);
        setUserInfo(raw ? (JSON.parse(raw) as UserInfo) : null);
      } catch {
        setUserInfo(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
