import ErrorState from './common/ErrorState';
import LoadingSpinner from './common/LoadingSpinner';
import MovieGrid from './movies/MovieGrid';
import Pagination from './movies/Pagination';
import { useMovies } from '../hooks/useMovies';
import type { MovieListType } from '../types/movie';

interface MoviesPageProps {
  endpoint: MovieListType;
  title: string;
}

const MoviesPage = ({ endpoint, title }: MoviesPageProps) => {
  const {
    movies,
    isLoading,
    error,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
  } = useMovies(endpoint);

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
        onAction={() => window.location.reload()}
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

      <MovieGrid movies={movies} />

    </div>
  );
};

export default MoviesPage;