import { useState, useEffect } from 'react';
import { getMovieDetail, getMovieCredits } from '../apis/movies';
import type { Movie } from '../types/movies';
import type { Credit } from '../types/credit';

export const useMovieDetail = (movieId: string) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieData, creditsData] = await Promise.all([
          getMovieDetail(movieId),
          getMovieCredits(movieId),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        console.error(err);
        setError('영화 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  return {
    movie,
    credits,
    loading,
    error,
  };
};
