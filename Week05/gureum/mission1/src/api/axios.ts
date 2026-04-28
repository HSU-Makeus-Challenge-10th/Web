import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../constants/key';

// 공통 axios 인스턴스: 서버 주소(baseURL)를 한 곳에서 관리
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 직전에 로컬스토리지 토큰을 자동으로 붙여 인증 헤더를 표준화
axiosInstance.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
  let accessToken: string | null = storedToken;

  // 과거 JSON.stringify("token") 형태로 저장된 값도 안전하게 복원
  if (storedToken) {
    try {
      const parsed = JSON.parse(storedToken);
      if (typeof parsed === 'string') {
        accessToken = parsed;
      }
    } catch {
      // raw 문자열이면 그대로 사용
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
