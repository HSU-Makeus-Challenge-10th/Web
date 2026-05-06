import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

export const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PrivateAPI = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 동시 요청 방지
let refreshTokenPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    const parsedRefreshToken = JSON.parse(refreshToken);

    // PrivateAPI를 사용하면 401시 무한 루프
    const response = await API.post('auth/refresh', {
      refresh: parsedRefreshToken,
    });

    const { accessToken } = response.data.data;

    localStorage.setItem(
      LOCAL_STORAGE_KEY.accessToken,
      JSON.stringify(accessToken)
    );

    return accessToken;
  } catch (error) {
    console.log(error);
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
    return null;
  }
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
        // JSON.parse 실패 시 원본 토큰 사용
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

  // 401 에러 처리 (토큰 만료)
  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry
  ) {
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
    } catch (refreshError) {
      refreshTokenPromise = null;
      return Promise.reject(refreshError);
    }
  }

  // 그 외 서버 에러
  return Promise.reject(error);
};

API.interceptors.response.use((response) => response, handleResponseError);

PrivateAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);
