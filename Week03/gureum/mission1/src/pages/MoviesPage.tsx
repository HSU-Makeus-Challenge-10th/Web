import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie.ts';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        setError(null);

        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            },
          }
        );

        if (!cancelled) {
          setMovies(data.results);
        }
      } catch (requestError) {
        console.error('영화 목록 조회 실패', requestError);

        if (!cancelled) {
          setError('영화 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchMovies();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray text-white p-8 flex items-center justify-center">
        <p className="text-lg">영화 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray text-white p-8 flex items-center justify-center">
        <p className="text-lg text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray text-white p-8">
      
      {/* 그리드 레이아웃 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies?.map((movie) => (
          <div 
            key={movie.id} 
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            {/* 포스터 이미지 */}
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto object-cover transition-all duration-300 group-hover:blur-sm"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-sm text-gray-400">
                이미지 없음
              </div>
            )}
            
            {/* 호버 시 나타나는 정보 */}
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100">
              <h3 className="text-lg font-bold text-center mb-2 text-white">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-300 text-center line-clamp-4 overflow-hidden">
                {movie.overview}
              </p>
              <div className="mt-2 text-yellow-400 font-semibold">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
              <div className="mt-1 text-gray-400 text-xs">
                {movie.release_date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;