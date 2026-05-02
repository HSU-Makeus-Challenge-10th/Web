import axios from 'axios';
import type {
  Credits,
  MovieDetail,
  MovieListResponse,
  MovieListType,
} from '../types/movie';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_KEY;

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
});

const ensureToken = () => {
  if (!TMDB_TOKEN) {
    throw new Error('TMDB API 토큰이 설정되지 않았습니다.');
  }
};

export const fetchMovies = async (type: MovieListType, page: number) => {
  ensureToken();

  const { data } = await tmdbClient.get<MovieListResponse>(`/movie/${type}`, {
    params: {
      language: 'ko-KR',
      page,
    },
  });

  return data;
};

export const fetchMovieDetail = async (movieId: string) => {
  ensureToken();

  const { data } = await tmdbClient.get<MovieDetail>(`/movie/${movieId}`, {
    params: { language: 'ko-KR' },
  });

  return data;
};

export const fetchMovieCredits = async (movieId: string) => {
  ensureToken();

  const { data } = await tmdbClient.get<Credits>(`/movie/${movieId}/credits`, {
    params: { language: 'ko-KR' },
  });

  return data;
};
