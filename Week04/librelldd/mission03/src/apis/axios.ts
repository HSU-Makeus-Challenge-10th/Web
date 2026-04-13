import axios, { type AxiosInstance } from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// 1. 커스텀 훅에서 getItem을 가져옵니다.
const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

export const axiosInstance: AxiosInstance = axios.create({
  // 2. 따옴표를 제거해야 실제 환경 변수 값이 들어갑니다.
  baseURL: import.meta.env.VITE_SERVER_API_URL, 
  headers: {
    // 3. 작은따옴표(') 대신 백틱(`)을 사용하고, 위에서 선언한 getItem()을 호출합니다.
    Authorization: `Bearer ${getItem()}`
  }
});