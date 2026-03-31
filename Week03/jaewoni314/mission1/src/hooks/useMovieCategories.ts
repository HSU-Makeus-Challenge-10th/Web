import { useMovies } from './useMovies';
import { moviesAPI } from '../apis/movies';

// 현재 상영작
export const useNowPlayingMovies = () => {
  return useMovies(moviesAPI.getNowPlaying);
};

// 평점 높은 영화
export const useTopRatedMovies = () => {
  return useMovies(moviesAPI.getTopRated);
};

// 개봉 예정작
export const useUpcomingMovies = () => {
  return useMovies(moviesAPI.getUpcoming);
};

// 인기 영화
export const usePopularMovies = () => {
  return useMovies(moviesAPI.getPopular);
};
