import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../constants/key';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: accessToken 자동 주입
axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
  if (raw) {
    // 레거시 JSON.stringify 저장 값도 안전하게 복원
    let token = raw;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'string') token = parsed;
    } catch {
      // raw 문자열 그대로 사용
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 토큰 만료/인증 실패(401) 시 로그인 페이지로 이동
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;
    const requestUrl = String(error?.config?.url ?? '');

    // 로그인/회원가입 요청 실패는 페이지 리다이렉트 대상에서 제외
    const isAuthFormRequest = requestUrl.includes('/v1/auth/signin') || requestUrl.includes('/v1/auth/signup');

    if (status === 401 && !isAuthFormRequest) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.userInfo);

      if (typeof window !== 'undefined') {
        const currentPath = `${window.location.pathname}${window.location.search}`;
        const redirect = encodeURIComponent(currentPath);
        if (!window.location.pathname.startsWith('/login')) {
          window.location.replace(`/login?redirect=${redirect}`);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
