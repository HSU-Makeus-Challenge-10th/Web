import { useState, useEffect } from 'react';
import type { Movie } from '../types/movies';

export const useMovies = (
  // fetchFunction이 results가 Movie[]인 객체를 반환한다고 명시
  fetchFunction: () => Promise<{ results: Movie[] }>
) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 의존성 배열을 비워 처음 렌더링할 때만 영화 데이터를 불러오는 훅
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchFunction();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
        setError('영화 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return { movies, loading, error };
};
