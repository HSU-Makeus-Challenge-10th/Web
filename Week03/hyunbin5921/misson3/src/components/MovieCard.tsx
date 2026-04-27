import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import type { Movie } from "../types/movie"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { category = "popular" } = useParams<{ category: string }>()
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null

  return (
    <Link to={`/movies/${category}/${movie.id}`} className="block" aria-label={`${movie.title} 상세보기`}>
      <div
        className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44
                   transition-transform transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {poster ? (
          <img src={poster} alt={`${movie.title} 영화의 이미지`} className="w-full h-64 object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-64 bg-gray-200" />
        )}

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
            <h2 className="text-sm font-semibold text-white line-clamp-2">{movie.title}</h2>
          </div>
        )}
      </div>
    </Link>
  )
}