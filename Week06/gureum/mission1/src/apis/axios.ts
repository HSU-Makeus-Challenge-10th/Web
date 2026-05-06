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

export default axiosInstance;
