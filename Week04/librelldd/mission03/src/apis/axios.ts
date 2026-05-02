import axios, { type AxiosInstance } from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";


const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

export const axiosInstance: AxiosInstance = axios.create({

  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {

    Authorization: `Bearer ${getItem()}`
  }
});