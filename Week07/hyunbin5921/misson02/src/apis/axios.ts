import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
} from "../utils/localStorage";

// ====================================================================
// 1. 타입 및 전역 변수 정의
// ====================================================================

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;
const REFRESH_ENDPOINT = "/v1/auth/refresh";

// 토큰 업데이트 함수 타입을 정의합니다. (AuthContext에서 주입됨)
type UpdateTokensCallback = (
  newAccessToken: string,
  newRefreshToken: string
) => void;

// AuthProvider로부터 받은 콜백 함수를 저장할 변수
let updateTokensInAuthContext: UpdateTokensCallback | null = null;

// 메인 Axios 인스턴스
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// Refresh 전용 Axios 인스턴스 (인터셉터 없음)
const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

/**
 * localStorage에서 읽은 토큰 문자열의 앞뒤 따옴표를 제거하여 JWT 순수 문자열만 반환합니다.
 */
const cleanToken = (token: string | null): string | null => {
  if (!token) return null;
  // 앞뒤의 따옴표 (")만 제거합니다.
  return token.replace(/^"|"$/g, "");
};

// ====================================================================
// 2. 요청 인터셉터 (메인 인스턴스에만 적용) - 🚨 [핵심 수정]
// ====================================================================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomInternalAxiosRequestConfig;

    // localStorage에서 토큰을 읽어오고, 따옴표를 제거합니다.
    const rawAccessToken = getAccessToken();
    const cleanAccessToken = cleanToken(rawAccessToken);

    console.log("🚨 [DEBUG 1] Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!cleanAccessToken,
      tokenPreview: cleanAccessToken
        ? cleanAccessToken.substring(0, 20) + "..."
        : "NO TOKEN",
      isRetry: !!customConfig._retry,
    });

    if (cleanAccessToken && config.headers) {
      // 🚨 [핵심 수정]: Response Interceptor에 의해 이미 Authorization 헤더가 설정된
      // 재시도 요청일 경우, localStorage에서 읽어온 값으로 덮어쓰지 않고 통과시킵니다.
      if (customConfig._retry && config.headers.Authorization) {
        console.log(
          "✅ [DEBUG 1.5] Using token set by Response Interceptor for retry (skipping overwrite)."
        );
        return config;
      }

      // 최초 요청의 경우, 정리된 토큰을 Bearer 헤더에 설정합니다.
      config.headers.Authorization = `Bearer ${cleanAccessToken}`;
    }

    return config;
  },
  (error) => {
    console.error("🚨 [DEBUG] Request Error:", error);
    return Promise.reject(error);
  }
);

// ====================================================================
// 3. 응답 인터셉터 (메인 인스턴스에만 적용) - 🚨 [수정: 지연시간 및 토큰 정리]
// ====================================================================
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ [DEBUG] Response Success:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    console.error("❌ [DEBUG 2] Response Error:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
      hasOriginalRequest: !!originalRequest,
    });

    // 401이 아니거나 원본 요청이 없으면 에러 반환
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // 이미 재시도된 요청이면 에러 반환
    if (originalRequest._retry) {
      console.error("🚨 [DEBUG 3] Already retried, failing request");
      return Promise.reject(error);
    }

    console.log("🚨 [DEBUG 4] 401 Unauthorized - Starting token refresh");
    originalRequest._retry = true;

    // 리프레시 토큰 확인
    const currentRefreshToken = getRefreshToken();
    console.log("🚨 [DEBUG 5] Current Refresh Token:", {
      exists: !!currentRefreshToken,
      preview: currentRefreshToken
        ? currentRefreshToken.substring(0, 20) + "..."
        : "NO TOKEN",
    });

    if (!currentRefreshToken) {
      console.error("🚨 [DEBUG 6] No refresh token, redirecting to login");
      removeAccessToken();
      removeRefreshToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 중복 리프레시 방지
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          console.log("🚨 [DEBUG 7] Sending refresh request");

          // refreshAxios 사용 (인터셉터 없는 인스턴스)
          const response = await refreshAxios.post(REFRESH_ENDPOINT, {
            refresh: cleanToken(currentRefreshToken), // Refresh 토큰도 정리하여 사용
          });

          console.log("🚨 [DEBUG 8] Refresh response:", {
            status: response.status,
            hasData: !!response.data?.data,
            hasAccessToken: !!response.data?.data?.accessToken,
            hasRefreshToken: !!response.data?.data?.refreshToken,
          });

          // 토큰 값을 정리합니다 (localStorage에 JSON 문자열로 저장되었을 경우 대비)
          const rawAccessToken = response.data.data.accessToken;
          const rawRefreshToken = response.data.data.refreshToken;

          const accessToken = cleanToken(rawAccessToken)!;
          const refreshToken = cleanToken(rawRefreshToken)!;

          // 새 토큰 저장 (localStorage)
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // 🚨 [추가된 부분]: AuthContext의 상태 업데이트
          if (typeof updateTokensInAuthContext === "function") {
            updateTokensInAuthContext(accessToken, refreshToken);
            console.log(
              "✅ [DEBUG 9.5] AuthContext state updated via callback."
            );
          } else {
            console.warn(
              "⚠️ AuthContext update callback (updateTokensInAuthContext) not available."
            );
          }

          console.log("✅ [DEBUG 9] New tokens saved successfully");
          return accessToken;
        } catch (refreshError: any) {
          console.error("❌ [DEBUG 10] Refresh failed:", {
            status: refreshError.response?.status,
            message: refreshError.message,
            data: refreshError.response?.data,
          });

          // 리프레시 실패 시 로그아웃
          removeAccessToken();
          removeRefreshToken();
          window.location.href = "/login";
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    try {
      const newAccessToken = await refreshPromise;

      // 🚨 [추가 수정]: newAccessToken 값 정리 (재시도 요청 시 올바른 토큰 사용 보장)
      const cleanAccessToken = cleanToken(newAccessToken)!;

      // 🚨 [추가 수정]: 서버 동기화 시간을 위한 짧은 지연 (50ms)
      await new Promise((resolve) => setTimeout(resolve, 50));

      console.log("🚨 [DEBUG 11] Retrying original request with new token");
      console.log(
        "🔍 [DEBUG RETRY] New Token Preview:",
        cleanAccessToken.substring(0, 20) + "..."
      );

      // 원본 요청에 새 토큰 적용
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${cleanAccessToken}`;

      // 캐싱 방지 헤더 제거 (일부 브라우저에서 304 Not Modified 방지)
      delete originalRequest.headers["If-Modified-Since"];
      delete originalRequest.headers["If-None-Match"];

      return axiosInstance.request(originalRequest);
    } catch (retryError) {
      console.error("❌ [DEBUG 12] Retry failed:", retryError);
      return Promise.reject(retryError);
    }
  }
);

// ====================================================================
// 4. 디버깅 헬퍼 함수 (개발 환경에서만 사용)
// ====================================================================
export const debugTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  console.log("🔍 Current Tokens:", {
    accessToken: {
      exists: !!accessToken,
      preview: accessToken ? accessToken.substring(0, 30) + "..." : "NO TOKEN",
      fullLength: accessToken?.length || 0,
    },
    refreshToken: {
      exists: !!refreshToken,
      preview: refreshToken
        ? refreshToken.substring(0, 30) + "..."
        : "NO TOKEN",
      fullLength: refreshToken?.length || 0,
    },
  });
};

// ====================================================================
// 5. AuthContext 연동을 위한 콜백 설정
// ====================================================================

/**
 * AuthContext에서 제공하는 updateTokens 함수를 등록합니다.
 * 이 함수는 axios 인터셉터에서 토큰 재발급 성공 시 호출됩니다.
 */
export const setAuthContextUpdateCallback = (
  callback: UpdateTokensCallback
) => {
  updateTokensInAuthContext = callback;
  console.log("✅ AuthContext update callback registered.");
};

// 개발 환경에서 전역으로 사용할 수 있게 노출
if (import.meta.env.DEV) {
  (window as any).debugTokens = debugTokens;
}
