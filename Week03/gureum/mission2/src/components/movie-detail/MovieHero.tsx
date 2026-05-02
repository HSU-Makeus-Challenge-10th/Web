import { Link } from 'react-router-dom';
import type { MovieDetail } from '../../types/movie';

interface MovieHeroProps {
  movie: MovieDetail;
  director?: string;
}

const MovieHero = ({ movie, director }: MovieHeroProps) => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: movie.backdrop_path
          ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-80 rounded-xl shadow-2xl border-4 border-white"
              onError={(event) => {
                event.currentTarget.src = '/api/placeholder/300/450';
              }}
            />
          </div>

          <div className="flex-1 text-white">
            <div className="mb-4">
              <Link
                to="/"
                className="bg-white/20 p-3 rounded inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
              >
                ← 뒤로가기
              </Link>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-xl italic text-gray-200 mb-6">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl mr-2">⭐</span>
                <span className="text-xl font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-300 ml-1">
                  ({movie.vote_count.toLocaleString()} 평가)
                </span>
              </div>

              <div className="text-lg">
                {movie.release_date} • {movie.runtime}분
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {director && (
              <div className="mb-6">
                <span className="text-gray-300">감독: </span>
                <span className="font-semibold">{director}</span>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-3">줄거리</h2>
              <p className="text-lg leading-relaxed text-gray-200">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
