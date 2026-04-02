import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      const accessToken = import.meta.env.VITE_TMDB_KEY;

      if (!accessToken) {
        setErrorMessage('VITE_TMDB_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('TMDB popular movies:', data);
        setMovies(data.results);
      } catch (error) {
        console.error('Failed to fetch popular movies:', error);
        setErrorMessage('TMDB 데이터를 불러오지 못했습니다. 토큰/네트워크 상태를 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-200">
        영화 목록을 불러오는 중...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center text-red-300">
        {errorMessage}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-300">
        표시할 영화 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}