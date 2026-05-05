import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 발생 시 accessToken 삭제
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.retry
    ) {
      if (originalRequest.url === "v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken,
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken,
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      originalRequest.retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const { getItem: getRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            const refreshToken = getRefreshToken();

            const { data } = await axiosInstance.post("v1/auth/refresh", {
              refresh: refreshToken,
            });

            const { setItem: setAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { setItem: setRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            setAccessToken(data.data.accessToken);
            setRefreshToken(data.data.refreshToken);

            return data.data.accessToken;
          } catch (refreshError) {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      return refreshPromise.then((newAccessToken) => {
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance.request(originalRequest);
        }
        return Promise.reject(error);
      });
    }

    return Promise.reject(error);
  },
);
