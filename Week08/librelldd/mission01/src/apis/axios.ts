import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

interface CustominternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; 
}


const getStorageItem = (key: string): string | null => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return null;
    let value = item;
    try {
      const parsed = JSON.parse(item);
      if (typeof parsed === "string") {
        value = parsed;
      }
    } catch {
      
    }
   
    return value.replace(/^["']|["']$/g, "").trim();
  } catch (e) {
    console.error("localStorage getItem error:", e);
    return null;
  }
};


const setStorageItem = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage setItem error:", e);
  }
};


const removeStorageItem = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error("localStorage removeItem error:", e);
  }
};


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getStorageItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken && config.url !== "/v1/auth/refresh") {
      if (config.headers) {
        if (typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${accessToken}`);
        } else {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//응답 인터셉터:401에러 발생 -> refresh토큰을 통한 토큰 갱신 및 대기 큐 순차 재시도 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustominternalAxiosRequestConfig = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    //401에러면서, 아직 재시도 하지 않은 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      //refresh 엔드포인트 자체에서 401에러가 발생한 경우 (Unauthorized), 세션 만료이므로 즉시 로그아웃 처리
      if (originalRequest.url === "/v1/auth/refresh") {
        removeStorageItem(LOCAL_STORAGE_KEY.accessToken);
        removeStorageItem(LOCAL_STORAGE_KEY.refreshToken);

        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 1. 이미 다른 요청 때문에 refresh가 진행 중인 경우, 큐에 넣고 대기시킵니다.
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // 대기 큐에서 깨어난 요청도 _retry 플래그 설정하여 무한루프 방지
            originalRequest._retry = true;
            // 재발급된 새 토큰으로 헤더를 업데이트한 후 재시도
            if (originalRequest.headers) {
              if (typeof originalRequest.headers.set === 'function') {
                originalRequest.headers.set('Authorization', `Bearer ${token}`);
              } else {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              }
            }
            return axiosInstance.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // 최초 401 에러 발생 시, 재시도 플래그와 refresh 진행 상태를 활성화합니다.
      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const refreshToken = getStorageItem(LOCAL_STORAGE_KEY.refreshToken);
          if (!refreshToken) {
            throw new Error("No refresh token found");
          }

          // refresh API 호출
          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          // 새로운 토큰 로컬 스토리지 업데이트
          setStorageItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
          setStorageItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

          const cleanToken = newAccessToken.replace(/^["']|["']$/g, "").trim();

          // 큐에 대기 중이던 다른 모든 401 요청들에게 새 토큰을 배포하여 일괄 성공 처리
          processQueue(null, cleanToken);

          // 현재의 오리지널 요청도 새 토큰으로 헤더를 직접 갱신
          if (originalRequest.headers) {
            if (typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${cleanToken}`);
            } else {
              originalRequest.headers['Authorization'] = `Bearer ${cleanToken}`;
            }
          }

          // 재시도 요청 실행 및 해결
          resolve(axiosInstance.request(originalRequest));
        } catch (refreshError) {
          // 토큰 재발급에 완전히 실패한 경우, 대기 중인 모든 요청들을 일괄 거절 처리
          processQueue(refreshError, null);

          // 스토리지 비우기 및 로그인 화면 리다이렉트
          removeStorageItem(LOCAL_STORAGE_KEY.accessToken);
          removeStorageItem(LOCAL_STORAGE_KEY.refreshToken);
          window.location.href = "/login";

          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    //401에러가 아닌 경우에 그대로 오류를 반환
    return Promise.reject(error);
  }
);