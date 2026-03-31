import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-3xl">
        <img
          src={imageUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-3 pb-3 pt-2 text-left">
        <p className="line-clamp-1 text-sm font-semibold text-zinc-50">{movie.title}</p>
        <p className="mt-1 text-xs text-zinc-400">
          {movie.release_date ? movie.release_date.slice(0, 4) : '미정'} • ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
