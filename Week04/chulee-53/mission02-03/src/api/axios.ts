import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const tokenStr = window.localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (tokenStr) {
    let token = tokenStr;
    try {
      token = JSON.parse(tokenStr);
    } catch {
      // 무시
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
