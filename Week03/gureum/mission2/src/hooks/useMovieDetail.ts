import { useEffect, useMemo, useState } from 'react';
import { fetchMovieCredits, fetchMovieDetail } from '../api/tmdb';
import type { Credits, MovieDetail } from '../types/movie';

export const useMovieDetail = (movieId?: string) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setError('영화 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    const loadMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [movieData, creditsData] = await Promise.all([
          fetchMovieDetail(movieId),
          fetchMovieCredits(movieId),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        console.error('영화 상세 API 호출 에러:', err);
        setError('영화 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadMovie();
  }, [movieId]);

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
  };
};
