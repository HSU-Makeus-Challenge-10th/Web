import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
});

// 요청마다 localStorage의 accessToken을 자동으로 헤더에 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
