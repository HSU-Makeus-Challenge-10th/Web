import { memo } from 'react';
import type { Movie } from '../../types/movie';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const getPosterUrl = (posterPath: string) => `https://image.tmdb.org/t/p/w500${posterPath}`;

const MovieGrid = ({ movies, onMovieClick }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
      {movies.map((movie) => (
        <button
          type="button"
          key={movie.id}
          onClick={() => onMovieClick?.(movie)}
          className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-auto object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />

          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100">
            <h3 className="text-lg font-bold text-center mb-2 text-white">{movie.title}</h3>
            <p className="text-sm text-gray-300 text-center line-clamp-4 overflow-hidden">
              {movie.overview}
            </p>
            <div className="mt-2 text-yellow-400 font-semibold">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
            <div className="mt-1 text-gray-400 text-xs">{movie.release_date}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default memo(MovieGrid);
