import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'upcoming';

interface MovieCategoryPageProps {
  category: MovieCategory;
  title: string;
}

export default function MovieCategoryPage({ category, title }: MovieCategoryPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
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
          `https://api.themoviedb.org/3/movie/${category}`,
          {
            params: {
              language: 'ko-KR',
              page,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setMovies(data.results);
      } catch (fetchError) {
        console.error('TMDB 카테고리 불러오기 실패:', fetchError);
        setError('에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  const handlePrev = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-7" aria-label={`${title} 목록`}>
      <header className="flex items-center justify-center">
        <div className="flex items-center gap-4 text-sm text-zinc-700">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1}
            className="h-10 w-10 rounded-lg bg-zinc-200 text-zinc-400 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            &lt;
          </button>
          <span className="min-w-16 text-center text-base font-semibold text-zinc-900">
            {page} 페이지
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="h-10 w-10 rounded-lg bg-fuchsia-200 text-fuchsia-700 transition hover:bg-fuchsia-300"
          >
            &gt;
          </button>
        </div>
      </header>

      <div className="mt-2 grid grid-cols-2 justify-items-center gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

