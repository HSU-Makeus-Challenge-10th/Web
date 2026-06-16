import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import { useFetch } from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieLanguage } from "../types/movie";

const INITIAL_FILTERS: MovieFilters = {
  query: "",
  include_adult: false,
  language: "ko-KR",
};

function HomePage() {
  const [draftFilters, setDraftFilters] = useState<MovieFilters>(INITIAL_FILTERS);
  const [submittedFilters, setSubmittedFilters] =
    useState<MovieFilters>(INITIAL_FILTERS);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, error } = useFetch(submittedFilters);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmittedFilters(draftFilters);
    },
    [draftFilters]
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftFilters((prev) => ({ ...prev, query: e.target.value }));
    },
    []
  );

  const handleIncludeAdultChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftFilters((prev) => ({ ...prev, include_adult: e.target.checked }));
    },
    []
  );

  const handleLanguageChange = useCallback((language: MovieLanguage) => {
    setDraftFilters((prev) => ({ ...prev, language }));
  }, []);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const movies = useMemo(() => {
    console.log("영화 리스트 가공");
    return data?.results ?? [];
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <MovieFilter
          query={draftFilters.query}
          includeAdult={draftFilters.include_adult}
          language={draftFilters.language}
          onSubmit={handleSubmit}
          onQueryChange={handleQueryChange}
          onIncludeAdultChange={handleIncludeAdultChange}
          onLanguageChange={handleLanguageChange}
        />

        {isLoading && <p className="text-white">로딩중...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default HomePage;
