/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { getMyInfo } from "../apis/auth";
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: ResponseMyInfoDto["data"] | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          setIsLoading(true);
          const res = await getMyInfo();
          setUser(res.data);
        } catch (error) {
          console.error("유저 정보를 가져오는데 실패했습니다.", error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [accessToken]);

  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  }; 
  const logout = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
