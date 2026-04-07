import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie }: MovieCardProps) {
  const score = movie.vote_average.toFixed(1);
  const scoreColor =
    movie.vote_average >= 7
      ? 'text-green-400'
      : movie.vote_average >= 5
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-rose-900/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* 포스터 */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
        {movie.poster_path ? (
          <img
            src={`${POSTER_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        {/* 평점 배지 */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className={`text-xs font-bold ${scoreColor}`}>{score}</span>
        </div>
      </div>

      {/* 텍스트 */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {movie.release_date?.slice(0, 4) || '연도 미상'}
        </p>
      </div>
    </Link>
  );
}
