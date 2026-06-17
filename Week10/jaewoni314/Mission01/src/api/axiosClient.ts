import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

if (!apiKey) {
  throw new Error("VITE_TMDB_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey,
  },
  headers: {
    accept: "application/json",
  },
});

export default axiosClient;
