import { useMovies } from './useMovies';
import { moviesAPI } from '../apis/movies';

export type MovieCategory =
  | 'popular'
  | 'now-playing'
  | 'top-rated'
  | 'upcoming';

// category <-> api 매핑
const apiMap = {
  popular: moviesAPI.getPopular,
  'now-playing': moviesAPI.getNowPlaying,
  'top-rated': moviesAPI.getTopRated,
  upcoming: moviesAPI.getUpcoming,
} as const;

// 커스텀 훅
export const useMovieCategories = (category: MovieCategory) => {
  return useMovies(apiMap[category]);
};
