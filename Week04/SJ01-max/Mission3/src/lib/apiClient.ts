import axios from 'axios';
import type { AuthTokens } from './schemas';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
});

// useLocalStorage와 동일한 키 'auth_tokens' 사용
apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const tokens: AuthTokens = JSON.parse(stored);
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
  } catch {
    // 파싱 실패 시 무시
  }
  return config;
});

export default apiClient;
