import { memo } from 'react';
import ErrorState from '../common/ErrorState';
import LoadingSpinner from '../common/LoadingSpinner';
import CastGrid from '../movie-detail/CastGrid';
import MovieHero from '../movie-detail/MovieHero';
import MovieMetaCards from '../movie-detail/MovieMetaCards';
import { useMovieDetail } from '../../hooks/useMovieDetail';
import type { Movie } from '../../types/movie';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const { movie: detailMovie, director, mainCast, isLoading, error, refetch } = useMovieDetail(
    String(movie.id)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
      onClick={onClose}
    >
      <article
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {isLoading && (
          <div className="p-10">
            <LoadingSpinner message="영화 정보를 불러오는 중..." size="lg" />
          </div>
        )}

        {(error || !detailMovie) && !isLoading && (
          <div className="p-10">
            <ErrorState
              icon="😅"
              message={error || '영화를 찾을 수 없습니다.'}
              actionLabel="다시 시도"
              onAction={() => {
                void refetch();
              }}
            />
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {detailMovie && !isLoading && !error && (
          <>
            <MovieHero
              movie={detailMovie}
              director={director}
              onClose={onClose}
              showImdbSearch
            />
            <CastGrid cast={mainCast} />
            <MovieMetaCards movie={detailMovie} />
          </>
        )}
      </article>
    </div>
  );
};

export default memo(MovieModal);
