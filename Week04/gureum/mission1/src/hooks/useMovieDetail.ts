import { useCallback, useMemo } from 'react';
import { fetchMovieCredits, fetchMovieDetail } from '../api/tmdb';
import type { Credits, MovieDetail } from '../types/movie';
import { useFetch } from './useFetch';

type MovieDetailPayload = {
  movie: MovieDetail;
  credits: Credits;
};

export const useMovieDetail = (movieId?: string) => {
  // 해석: 상세 정보 API와 크레딧 API를 따로 관리하지 않고,
  // "한 번의 fetch 작업"으로 묶어서 useFetch에 맡깁니다.
  const fetcher = useCallback(async (): Promise<MovieDetailPayload> => {
    if (!movieId) {
      throw new Error('영화 ID가 없습니다.');
    }

    const [movie, credits] = await Promise.all([
      fetchMovieDetail(movieId),
      fetchMovieCredits(movieId),
    ]);

    return { movie, credits };
  }, [movieId]);

  // movieId가 바뀌면 useFetch가 자동으로 다시 요청합니다.
  const { data, isLoading, error, refetch } = useFetch(fetcher, [movieId], {
    errorMessage: movieId
      ? '영화 정보를 불러오는데 실패했습니다.'
      : '영화 ID가 없습니다.',
  });

  const movie = data?.movie ?? null;
  const credits = data?.credits ?? null;

  // 원본 credits를 그대로 쓰지 않고, 화면에 필요한 값만 계산해 전달합니다.
  const director = useMemo(
    () => credits?.crew.find((person) => person.job === 'Director')?.name,
    [credits]
  );

  const mainCast = useMemo(() => credits?.cast.slice(0, 10) ?? [], [credits]);

  return {
    movie,
    director,
    mainCast,
    isLoading,
    error,
    refetch,
  };
};
