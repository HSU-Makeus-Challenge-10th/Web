import { useState, useEffect } from 'react';
import type { Movie, MovieResponse } from '../types/movies';

export const useMovies = (
  fetchFunction: (page?: number) => Promise<MovieResponse>
) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFunction(currentPage);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 0);
      } catch (err) {
        console.error(err);
        setError('영화 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [currentPage, fetchFunction]);

  const onChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    onChangePage,
  };
};
