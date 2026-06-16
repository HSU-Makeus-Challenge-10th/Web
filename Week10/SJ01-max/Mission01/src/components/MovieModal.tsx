import { TMDB_BACKDROP_BASE_URL, TMDB_POSTER_BASE_URL } from "../constants/movie";
import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const handleSearchImdb = () => {
    const url = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-lg bg-white"
      >
        <div className="relative">
          {movie.backdrop_path ? (
            <img
              src={`${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="aspect-video w-full bg-gray-300" />
          )}

          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
            aria-label="닫기"
          >
            ✕
          </button>

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <h2 className="text-xl font-bold">{movie.title}</h2>
            <p className="text-sm text-gray-200">{movie.original_title}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row">
          {movie.poster_path && (
            <img
              src={`${TMDB_POSTER_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-40 flex-none self-center rounded sm:self-start"
            />
          )}

          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold">
              <span className="text-blue-600">{movie.vote_average.toFixed(1)}</span>{" "}
              <span className="text-sm text-gray-500">
                ({movie.vote_count} 평가)
              </span>
            </p>

            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700">개봉일</p>
              <p className="text-sm text-gray-600">{movie.release_date}</p>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700">인기도</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-blue-500"
                  style={{ width: `${Math.min(movie.popularity, 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700">줄거리</p>
              <p className="text-sm text-gray-600">{movie.overview}</p>
            </div>

            <div className="mt-4 flex justify-center gap-2 sm:justify-start">
              <button
                onClick={handleSearchImdb}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                IMDb에서 검색
              </button>
              <button
                onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
