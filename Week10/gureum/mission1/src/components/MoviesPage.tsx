import { useCallback, useState } from 'react';
import ErrorState from './common/ErrorState';
import LoadingSpinner from './common/LoadingSpinner';
import MovieModal from './movies/MovieModal';
import MovieGrid from './movies/MovieGrid';
import Pagination from './movies/Pagination';
import { useMovies } from '../hooks/useMovies';
import type { Movie, MovieListType } from '../types/movie';

interface MoviesPageProps {
  endpoint: MovieListType;
  title: string;
}

const MoviesPage = ({ endpoint, title }: MoviesPageProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  // 이제 목록 페이지는 "다시 시도"를 위해 refetch를 받아옵니다.
  // 예전처럼 브라우저 전체를 새로고침하지 않아도 현재 요청만 다시 보낼 수 있습니다.
  const {
    movies,
    isLoading,
    error,
    refetch,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
  } = useMovies(endpoint);

  const openMovieModal = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const closeMovieModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 로딩 상태
  if (isLoading) {
    return <LoadingSpinner message="영화 데이터를 불러오는 중..." />;
  }

  // 에러 상태
  if (error) {
    return (
      <ErrorState
        message={error}
        actionLabel="다시 시도"
        // 사용자 입장에서는 같은 화면에서 바로 재시도됩니다.
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">{title}</h1>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={goPrevPage}
        onNext={goNextPage}
      />
      <br />

      <MovieGrid movies={movies} onMovieClick={openMovieModal} />

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeMovieModal} />}
    </div>
  );
};

export default MoviesPage;
