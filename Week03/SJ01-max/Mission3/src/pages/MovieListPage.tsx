import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const accessToken = import.meta.env.VITE_TMDB_KEY;

      if (!accessToken) {
        setError('VITE_TMDB_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular',
          {
            params: {
              language: 'ko-KR',
              page: 1,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setMovies(data.results);
      } catch (fetchError) {
        console.error('인기 영화 불러오기 실패:', fetchError);
        setError('에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="text-left">
        <h1 className="text-2xl font-bold text-zinc-50">인기 영화</h1>
        <p className="mt-1 text-sm text-zinc-400">카드를 클릭하면 상세 정보를 확인할 수 있어요.</p>
      </header>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
