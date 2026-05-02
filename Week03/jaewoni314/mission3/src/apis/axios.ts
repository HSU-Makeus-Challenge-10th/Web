import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const accessToken = import.meta.env.VITE_API_KEY;

// 기본 axios 인스턴스 생성
export const API = axios.create({
  baseURL: baseURL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});
