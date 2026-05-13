import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

const baseEnvURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const baseURL = `${baseEnvURL.replace(/\/$/, '')}/v1`;

const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

export const API = axios.create({
  baseURL: baseURL,
});
export const PrivateAPI = axios.create({
  baseURL: baseURL,
});

// 동시 요청 방지
let refreshTokenPromise: Promise<string | null> | null = null;
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
  if (!refreshToken) {
    return null;
  }
  const parsedRefreshToken = JSON.parse(refreshToken);
  
  // 명시적으로 /auth/refresh 경로 사용
  const response = await API.post('/auth/refresh', {
    refresh: parsedRefreshToken,
  });
  const { accessToken } = response.data.data;

  localStorage.setItem(
    LOCAL_STORAGE_KEY.accessToken,
    JSON.stringify(accessToken)
  );

  return accessToken;
};

// 요청 인터셉터
PrivateAPI.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      try {
        const parsedToken = JSON.parse(accessToken);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch (error) {
        console.log(error);
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
const handleResponseError = async (error: AxiosError) => {
  // 네트워크 에러 처리
  if (axios.isAxiosError(error) && !error.response) {
    return Promise.reject(new Error('서버에 연결할 수 없습니다.'));
  }

  const originalRequest = error.config as typeof error.config & {
    _retry?: boolean;
  };

  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry
  ) {
    // 리프레시 요청 실패 시 무한 루프를 방지 및 로그아웃
    // url 비교 시 슬래시가 포함된 경로로 체크하도록 수정
    if (originalRequest.url === '/auth/refresh') {
      console.error('Refresh token is invalid or expired. Logging out.');
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken();
      }
      const newAccessToken = await refreshTokenPromise;
      refreshTokenPromise = null;
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return PrivateAPI(originalRequest);
      }
    } catch (err) {
      refreshTokenPromise = null;
      console.error('Error during token refresh:', err);
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
};

API.interceptors.response.use((response) => response, handleResponseError);

PrivateAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);