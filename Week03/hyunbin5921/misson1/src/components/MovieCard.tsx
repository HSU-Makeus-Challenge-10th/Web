import { useState } from "react";
import type { Movie } from "../types/movie";
import { useNavigate} from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  return (
    <div
    onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative rounded-xl shadow-lg overflow-hidden w-50 cursor-pointer transition-tranform hover:scale-105 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className=""
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path} 영화의 이미지`}
        alt={`${movie.title}`}
      />
      {isHovered && (
        <div
          className=" absolute inset-0 bg-gradient-to-t from-black/50 
        to transparent backdrop-blur-md text-white transition flex flex-col
         justify-center p-4"
        >
          <h2 className="text-lg font-bold lending-snug">{movie.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-1 line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}
