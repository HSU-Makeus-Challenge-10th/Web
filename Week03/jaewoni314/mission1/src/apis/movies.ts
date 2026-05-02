import { API } from './axios';
import type { MovieResponse } from '../types/movies';

// 영화 API 함수
const fetchMovies = async (endpoint: string): Promise<MovieResponse> => {
  const { data } = await API.get<MovieResponse>(endpoint);
  return data;
};

// 개별 API 함수들
export const moviesAPI = {
  getNowPlaying: () => fetchMovies('/movie/now_playing'),
  getTopRated: () => fetchMovies('/movie/top_rated'),
  getUpcoming: () => fetchMovies('/movie/upcoming'),
  getPopular: () => fetchMovies('/movie/popular'),
};
