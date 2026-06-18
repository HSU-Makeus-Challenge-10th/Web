import { useCallback, useMemo, useState } from 'react';
import { fetchMovies, searchMovies } from '../api/tmdb';
import type { Movie, MovieLanguage, MovieSearchParams } from '../types/movie';
import { useFetch } from './useFetch';

interface SearchDraft {
  query: string;
  includeAdult: boolean;
  language: MovieLanguage;
}

const initialDraft: SearchDraft = {
  query: '',
  includeAdult: false,
  language: 'ko-KR',
};

export const useMovieSearch = () => {
  const [draft, setDraft] = useState<SearchDraft>(initialDraft);
  const [submitted, setSubmitted] = useState<SearchDraft>(initialDraft);
  const [currentPage, setCurrentPage] = useState(1);

  const trimmedQuery = submitted.query.trim();

  const searchParams = useMemo<MovieSearchParams>(
    () => ({
      query: trimmedQuery,
      includeAdult: submitted.includeAdult,
      language: submitted.language,
      page: currentPage,
    }),
    [trimmedQuery, submitted.includeAdult, submitted.language, currentPage]
  );

  const fetcher = useCallback(() => {
    if (!searchParams.query) {
      return fetchMovies('popular', searchParams.page, searchParams.language);
    }

    return searchMovies(searchParams);
  }, [searchParams]);

  const { data, isLoading, error, refetch } = useFetch(fetcher, {
    errorMessage: '영화 데이터를 불러오는데 실패했습니다.',
  });

  const movies = useMemo<Movie[]>(
    () => (data?.results ?? []).filter((movie) => movie.poster_path),
    [data]
  );
  const totalPages = useMemo(() => Math.min(data?.total_pages ?? 1, 500), [data]);
  const title = searchParams.query ? `"${searchParams.query}" 검색 결과` : '인기 영화';

  const updateQuery = useCallback((query: string) => {
    setDraft((prev) => ({ ...prev, query }));
  }, []);

  const updateIncludeAdult = useCallback((includeAdult: boolean) => {
    setDraft((prev) => ({ ...prev, includeAdult }));
  }, []);

  const updateLanguage = useCallback((language: MovieLanguage) => {
    setDraft((prev) => ({ ...prev, language }));
  }, []);

  const submitSearch = useCallback(() => {
    setCurrentPage(1);
    setSubmitted(draft);
  }, [draft]);

  const goPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return {
    draft,
    submitted,
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
  };
};
