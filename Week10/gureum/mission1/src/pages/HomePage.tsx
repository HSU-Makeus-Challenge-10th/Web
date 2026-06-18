import { useCallback, useState } from 'react';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieGrid from '../components/movies/MovieGrid';
import MovieModal from '../components/movies/MovieModal';
import MovieSearchForm from '../components/movies/MovieSearchForm';
import Pagination from '../components/movies/Pagination';
import { useMovieSearch } from '../hooks/useMovieSearch';
import type { Movie } from '../types/movie';

const HomePage = () => {
  const {
    draft,
    movies,
    title,
    isLoading,
    error,
    currentPage,
    totalPages,
    refetch,
    updateQuery,
    updateIncludeAdult,
    updateLanguage,
    submitSearch,
    goPrevPage,
    goNextPage,
  } = useMovieSearch();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openMovieModal = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const closeMovieModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 md:p-8">
      <MovieSearchForm
        query={draft.query}
        includeAdult={draft.includeAdult}
        language={draft.language}
        onQueryChange={updateQuery}
        onIncludeAdultChange={updateIncludeAdult}
        onLanguageChange={updateLanguage}
        onSubmit={submitSearch}
      />

      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={goPrevPage}
            onNext={goNextPage}
          />
        </div>

        {isLoading && <LoadingSpinner message="영화 데이터를 불러오는 중..." />}

        {error && !isLoading && (
          <ErrorState
            message={error}
            actionLabel="다시 시도"
            onAction={() => {
              void refetch();
            }}
          />
        )}

        {!isLoading && !error && movies.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onMovieClick={openMovieModal} />
        )}
      </section>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeMovieModal} />}
    </main>
  );
};

export default HomePage;
