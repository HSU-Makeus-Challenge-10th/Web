import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';
import { LOCAL_STORAGE_KEYS } from '../constants/key';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

const getStoredToken = (key: string) => {
  const storedToken = localStorage.getItem(key);

  if (!storedToken) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedToken);
    return typeof parsed === 'string' ? parsed : storedToken;
  } catch {
    return storedToken;
  }
};

const setStoredToken = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const clearAuthTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
};

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false;

  return [
    '/v1/auth/signin',
    '/v1/auth/signup',
    '/v1/auth/refresh',
  ].some((path) => url.includes(path));
};

const moveToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

const requestNewAccessToken = async () => {
  const refreshToken = getStoredToken(LOCAL_STORAGE_KEYS.refreshToken);

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다.');
  }

  const { data } = await refreshAxios.post('/v1/auth/refresh', {
    refresh: refreshToken,
  });

  const nextAccessToken = data.data.accessToken as string;
  const nextRefreshToken = data.data.refreshToken as string;

  setStoredToken(LOCAL_STORAGE_KEYS.accessToken, nextAccessToken);
  setStoredToken(LOCAL_STORAGE_KEYS.refreshToken, nextRefreshToken);

  return nextAccessToken;
};

let refreshPromise: Promise<string> | null = null;

// 공통 axios 인스턴스: 서버 주소(baseURL)를 한 곳에서 관리
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 직전에 로컬스토리지 토큰을 자동으로 붙여 인증 헤더를 표준화
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredToken(LOCAL_STORAGE_KEYS.accessToken);

  if (accessToken) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const statusCode = error.response?.status;

    if (!originalRequest || statusCode !== 401 || shouldSkipRefresh(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuthTokens();
      moveToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= requestNewAccessToken().finally(() => {
        refreshPromise = null;
      });

      const newAccessToken = await refreshPromise;

      if (!originalRequest.headers) {
        originalRequest.headers = new AxiosHeaders();
      }

      originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      moveToLogin();
      return Promise.reject(refreshError);
    }
  }
);
