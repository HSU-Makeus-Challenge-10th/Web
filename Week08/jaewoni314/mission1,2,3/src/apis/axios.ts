// src/apis/axios.ts
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

export const API = axios.create({ baseURL });
export const PrivateAPI = axios.create({ baseURL });

let refreshTokenPromise: Promise<string | null> | null = null;

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  const storedRefreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
  const parsedRefreshToken = safeParse<string>(storedRefreshToken);

  if (!parsedRefreshToken) {
    // 저장된 리프레시 토큰이 없거나 형식이 이상하면 바로 로그아웃
    useAuthStore.getState().logout();
    window.location.href = '/login';
    return null;
  }

  const response = await API.post('auth/refresh', {
    refresh: parsedRefreshToken,
  });

  const { accessToken } = response.data;

  localStorage.setItem(
    LOCAL_STORAGE_KEY.accessToken,
    JSON.stringify(accessToken)
  );

  return accessToken;
};

PrivateAPI.interceptors.request.use(
  (config) => {
    const storedAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const parsedToken = safeParse<string>(storedAccessToken);

    if (parsedToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${parsedToken}`;
    } else if (storedAccessToken) {
      // 문자열은 있는데 파싱 실패한 경우 → 토큰 손상된 것, 강제 로그아웃
      console.error('Invalid access token format, logging out.');
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(new Error('Invalid token format'));
    }

    return config;
  },
  (error) => Promise.reject(error)
);