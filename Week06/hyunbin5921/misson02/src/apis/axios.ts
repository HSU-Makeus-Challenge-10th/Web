import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

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

  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (!error.response) return Promise.reject(error);

    const status = error.response.status as number;
    const path = window.location.pathname;
    const isOnLogin = path.startsWith("/login");
    const isAuthEndpoint =
      originalRequest.url?.includes("/v1/auth/") &&
      !originalRequest.url?.includes("/v1/lps");

    if (status !== 401) return Promise.reject(error);

    if (originalRequest.url?.includes("/v1/auth/refresh")) {
      const { removeItem: removeAccessToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
      );
      const { removeItem: removeRefreshToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
      );
      removeAccessToken();
      removeRefreshToken();

      if (!isOnLogin) {
        const redirect = encodeURIComponent(path + window.location.search);
        window.location.replace(`/login?redirect=${redirect}`);
      }
      return Promise.reject(error);
    }

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const { getItem: getRefreshToken } = useLocalStorage(
      LOCAL_STORAGE_KEY.refreshToken
    );
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      const { removeItem: removeAccessToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
      );
      const { removeItem: removeRefreshToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
      );
      removeAccessToken();
      removeRefreshToken();
      if (!isOnLogin) {
        const redirect = encodeURIComponent(path + window.location.search);
        window.location.replace(`/login?redirect=${redirect}`);
      }
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        const { data } = await axiosInstance.post("/v1/auth/refresh", {
          refresh: refreshToken,
        });

        const { setItem: setAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { setItem: setRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        setAccessToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
        return data.data.accessToken as string;
      })()
        .catch(() => {
          const { removeItem: removeAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken
          );
          const { removeItem: removeRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          removeAccessToken();
          removeRefreshToken();
          if (!isOnLogin) {
            const redirect = encodeURIComponent(path + window.location.search);
            window.location.replace(`/login?redirect=${redirect}`);
          }
          throw error;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise.then((newAccessToken) => {
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosInstance.request(originalRequest);
    });
  }
);
