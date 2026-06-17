import { memo } from "react";
import { TMDB_POSTER_BASE_URL } from "../constants/movie";
import type { Movie } from "../types/movie";
import { getRatingColor } from "../utils/movie";

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

function MovieCard({ movie, onSelect }: MovieCardProps) {
  console.log("MovieCard 렌더링:", movie.title);

  return (
    <button
  type="button"
  onClick={() => onSelect(movie)}
  className="w-full cursor-pointer overflow-hidden rounded-lg bg-white text-left shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
>
      <div className="relative">
        {movie.poster_path ? (
          <img
            src={`${TMDB_POSTER_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="aspect-2/3 w-full object-cover"
          />
        ) : (
          <div className="aspect-2/3 w-full bg-gray-200" />
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${getRatingColor(
            movie.vote_average
          )}`}
        >
          {movie.vote_average.toFixed(1)}
        </span>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{movie.title}</h3>
        <p className="text-xs text-gray-500">{movie.release_date}</p>
        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
          {movie.overview}
        </p>
      </div>
    </button>
  );
}

export default memo(MovieCard);
