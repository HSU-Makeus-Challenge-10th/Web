import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import type { RequestSignInDto } from "../types/auth";

// 🚨 [필수] axios 인터셉터 연동을 위해 import (파일명이 'axios'라고 가정)
// 이 함수는 외부에서 정의되어 있으므로, AuthProvider 마운트 시 등록이 필요합니다.
import { setAuthContextUpdateCallback } from "../apis/axios";

const decodeToken = (token: string): { id: number; name: string } | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const decoded = JSON.parse(atob(padded));

    const userId = decoded.id || decoded.userId || decoded.sub || null;
    const userName = decoded.name || decoded.username || decoded.email || "";

    if (!userId) return null;

    return {
      id: typeof userId === "string" ? parseInt(userId, 10) : userId,
      name: userName,
    };
  } catch (e) {
    return null;
  }
};

// ----------------------------------------------------
// 🚀 FIX: localStorage에서 읽어온 닉네임 값 정리 함수 (저장 오류 처리)
// ----------------------------------------------------
const cleanStoredUserName = (rawStoredValue: string | null): string | null => {
  if (rawStoredValue === null) return null;

  // rawStoredValue가 '""' (JSON 직렬화된 빈 문자열) 인 경우
  if (rawStoredValue === '""') {
    return "";
  }

  // JSON 파싱 시도 (useLocalStorage가 JSON.stringify를 사용했다고 가정)
  try {
    const parsed = JSON.parse(rawStoredValue);
    if (typeof parsed === "string") {
      return parsed.trim() === "" ? "" : parsed;
    }
  } catch (e) {
    // 파싱 실패 시, 원본 값을 사용 (trim만 적용)
  }

  const trimmed = rawStoredValue.trim();
  return trimmed === "" ? null : trimmed;
};
// ----------------------------------------------------

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  userId: number | null;
  setUserId: (id: number | null) => void;
  setUserName: (name: string | null) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;

  login: (data: {
    accessToken: string;
    refreshToken: string;
    name: string;
  }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userName: null,
  userId: null,
  setUserId: () => {},
  setUserName: () => {},
  updateTokens: () => {},
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
  const {
    getItem: getUserNameFromStorage,
    setItem: setUserNameInStorage,
    removeItem: removeUserNameFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.userName);

  const {
    getItem: getUserIdFromStorage,
    setItem: setUserIdInStorage,
    removeItem: removeUserIdFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.userId || "userId");

  const initialAccessToken = getAccessTokenFromStorage();

  // 🚀 FIX 적용: localStorage에서 읽은 닉네임 값을 클리닝합니다.
  const rawInitialUserName = getUserNameFromStorage();
  const initialUserName = cleanStoredUserName(rawInitialUserName);

  const [accessToken, setAccessToken] = useState<string | null>(
    initialAccessToken
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  // 🚀 FIX 적용: 클리닝된 값으로 상태를 초기화
  const [userName, setUserName] = useState<string | null>(initialUserName);

  const [userId, setUserId] = useState<number | null>(() => {
    const storedUserId = getUserIdFromStorage();
    if (storedUserId) {
      const id = parseInt(storedUserId, 10);
      if (!isNaN(id)) return id;
    }
    const token = getAccessTokenFromStorage();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.id) {
        setUserIdInStorage(String(decoded.id));
        return decoded.id;
      }
    }
    return null;
  });

  // 🚨 [수정된 login 함수]: 서버 name 우선 사용
  const login = ({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    name: serverName, // 서버 응답에서 직접 받은 name
  }: {
    accessToken: string;
    refreshToken: string;
    name: string;
  }) => {
    const decodedUser = decodeToken(newAccessToken);
    const newUserId: number | null = decodedUser ? decodedUser.id : null;

    // 🚀 FIX: 서버 응답의 name을 그대로 사용합니다.
    const newUserName: string = serverName;

    // Local Storage 저장
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);
    setUserNameInStorage(newUserName);
    if (newUserId) {
      setUserIdInStorage(String(newUserId));
    }

    // React 상태 업데이트
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUserName(newUserName);
    setUserId(newUserId);

    // alert("로그인 성공") 등은 Mutation onSuccess에서 처리
  };

  // 🚨 [추가된 updateTokens 함수]: axios 인터셉터용
  const updateTokens = (newAccessToken: string, newRefreshToken: string) => {
    // Local Storage 업데이트
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);

    // React 상태 업데이트
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    // ID와 Name도 토큰에서 다시 추출하여 업데이트
    const decoded = decodeToken(newAccessToken);
    if (decoded) {
      setUserId(decoded.id);
      setUserIdInStorage(String(decoded.id));

      // 닉네임 상태 업데이트
      const decodedName = decoded.name || "";
      setUserName(decodedName);
      setUserNameInStorage(decodedName);
    }
  };

  const logout = () => {
    // LocalStorage에서 삭제
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    removeUserNameFromStorage();
    removeUserIdFromStorage();

    // React 상태 초기화
    setAccessToken(null);
    setRefreshToken(null);
    setUserName(null);
    setUserId(null);

    // alert("로그아웃 성공") 등은 Mutation onSuccess에서 처리
  };

  useEffect(() => {
    if (initialAccessToken && !userId) {
      const decoded = decodeToken(initialAccessToken);
      if (decoded && decoded.id) {
        setUserId(decoded.id);
        if (!initialUserName && decoded.name) {
          setUserName(decoded.name);
          setUserNameInStorage(decoded.name);
        }
      }
    }

    // 🚨 [필수 연동]: 마운트 시 axios 인터셉터에 updateTokens 함수 등록 (주석 해제)
    setAuthContextUpdateCallback(updateTokens);
  }, [initialAccessToken, initialUserName, userId, updateTokens]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userName,
        userId,
        login,
        logout,
        setUserId,
        setUserName,
        updateTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context: AuthContextType = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
