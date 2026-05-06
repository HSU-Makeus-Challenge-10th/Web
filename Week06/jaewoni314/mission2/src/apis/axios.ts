import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const LOCALSTORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

export const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export const PrivateAPI = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let refreshTokenPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem(LOCALSTORAGE_KEY.refreshToken);
    if (!refreshToken) throw new Error('No refresh token found');

    let parsedRefreshToken = refreshToken;
    try {
      parsedRefreshToken = JSON.parse(refreshToken);
    } catch {
      parsedRefreshToken = refreshToken;
    }

    const response = await API.post('v1/auth/refresh', {
      refresh: parsedRefreshToken,
    });
    const accessToken = response.data.data;
    localStorage.setItem(LOCALSTORAGE_KEY.accessToken, JSON.stringify(accessToken));
    return accessToken;
  } catch (error) {
    console.log(error);
    localStorage.removeItem(LOCALSTORAGE_KEY.accessToken);
    localStorage.removeItem(LOCALSTORAGE_KEY.refreshToken);
    return null;
  }
};

// PrivateAPI 요청 인터셉터 — Authorization 헤더 추가
PrivateAPI.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCALSTORAGE_KEY.accessToken);
    if (accessToken) {
      let token = accessToken;
      try {
        token = JSON.parse(accessToken);
      } catch {
        token = accessToken;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleResponseError = async (error: AxiosError) => {
  if (!axios.isAxiosError(error) || !error.response) {
    return Promise.reject(new Error('알 수 없는 오류'));
  }

  const originalRequest = error.config as typeof error.config & { _retry?: boolean };

  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken();
      }
      const newAccessToken = await refreshTokenPromise;
      refreshTokenPromise = null;

      if (newAccessToken) {
        originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
        return PrivateAPI(originalRequest);
      }
    } catch (refreshError) {
      refreshTokenPromise = null;
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

API.interceptors.response.use((response) => response, handleResponseError);
PrivateAPI.interceptors.response.use((response) => response, handleResponseError);