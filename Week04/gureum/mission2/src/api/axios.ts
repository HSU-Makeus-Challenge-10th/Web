import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../constants/key';

// 공통 axios 인스턴스: 서버 주소(baseURL)를 한 곳에서 관리
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 직전에 로컬스토리지 토큰을 자동으로 붙여 인증 헤더를 표준화
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
