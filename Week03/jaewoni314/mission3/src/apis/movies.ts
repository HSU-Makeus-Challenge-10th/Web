import { API } from './axios';
import type { MovieResponse, Movie } from '../types/movies';
import type { Credit } from '../types/credit';

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

// 영화 상세 정보
export const getMovieDetail = async (movieId: string): Promise<Movie> => {
  const { data } = await API.get<Movie>(`/movie/${movieId}?language=ko-KR`);
  return data;
};

// 영화 크레딧 정보
export const getMovieCredits = async (movieId: string): Promise<Credit> => {
  const { data } = await API.get<Credit>(
    `/movie/${movieId}/credits?language=ko-KR`
  );
  return data;
};

// 영화 카테고리별 API
export const moviesAPI = {
  getNowPlaying: (page: number = 1) =>
    fetchMovies('/movie/now_playing?language=ko-KR', page),
  getTopRated: (page: number = 1) =>
    fetchMovies('/movie/top_rated?language=ko-KR', page),
  getUpcoming: (page: number = 1) =>
    fetchMovies('/movie/upcoming?language=ko-KR', page),
  getPopular: (page: number = 1) =>
    fetchMovies('/movie/popular?language=ko-KR', page),
};
