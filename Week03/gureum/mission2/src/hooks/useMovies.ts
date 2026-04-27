import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/tmdb';
import type { Movie, MovieListType } from '../types/movie';

export const useMovies = (type: MovieListType) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchMovies(type, currentPage);

        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error('영화 목록 API 호출 에러:', err);
        setError('영화 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadMovies();
  }, [type, currentPage]);

  const goPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return {
    movies,
    isLoading,
    error,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
  };
};
