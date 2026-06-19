import { memo } from "react"; 
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImageImage = "https://otithee.com/img/fallback/fallback-2.png";

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-violet-400 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.25)]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-100">
        <img
          src={
            movie.poster_path
              ? `${imageBaseUrl}${movie.poster_path}`
              : fallbackImageImage
          }
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute right-4 top-4 flex items-center justify-center rounded-xl bg-violet-600/90 px-3 py-1.5 text-sm font-extrabold text-white shadow-lg backdrop-blur-md">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-1 text-xl font-extrabold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-violet-600">
          {movie.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm font-bold text-zinc-500">
          <span>{movie.release_date || "미정"}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400/50"></span>
          <span>{movie.original_language?.toUpperCase() || ""}</span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-zinc-600">
          {movie.overview || "등록된 줄거리가 없습니다."}
        </p>
      </div>
    </div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;