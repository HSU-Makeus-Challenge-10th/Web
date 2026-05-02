import axios from 'axios';

// Vite 환경 변수에서 토큰을 가져오는 함수
export const getTmdbToken = () => {
    return import.meta.env.VITE_TMDB_TOKEN;
};

// API 요청을 위한 공통 헤더를 생성하는 함수
export const getTmdbHeaders = () => {
    return {
        Authorization: `Bearer ${getTmdbToken()}`,
    };
};

// 기본 axios 인스턴스 (필요 시 공통 설정을 위해 사용)
const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default tmdbApi;
