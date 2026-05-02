import { API } from './axios';
import type { MovieResponse } from '../types/movies';

// 영화 API 함수
const fetchMovies = async (
  endpoint: string,
  page: number = 1
): Promise<MovieResponse> => {
  const { data } = await API.get<MovieResponse>(endpoint, {
    params: { page },
  });
  return data;
};

// 개별 API 함수들
export const moviesAPI = {
  getNowPlaying: (page: number = 1) => fetchMovies('/movie/now_playing', page),
  getTopRated: (page: number = 1) => fetchMovies('/movie/top_rated', page),
  getUpcoming: (page: number = 1) => fetchMovies('/movie/upcoming', page),
  getPopular: (page: number = 1) => fetchMovies('/movie/popular', page),
};
