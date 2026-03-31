import { useState } from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div
      className="relative aspect-[2/3] w-full max-w-[130px] cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageUrl}
        alt={`${movie.title} 영화 포스터`}
        className="h-full w-full object-cover"
      />

      {isHovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-transparent p-3 text-center text-white backdrop-blur-sm">
          <h2 className="text-sm font-bold leading-snug">{movie.title}</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-gray-200 line-clamp-4">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}

