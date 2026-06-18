import { useCallback, useMemo, useState } from 'react';
import { fetchMovies } from '../api/tmdb';
import type { Movie, MovieListType } from '../types/movie';
import { useFetch } from './useFetch';

export const useMovies = (type: MovieListType) => {
  const [currentPage, setCurrentPage] = useState(1);

  // "영화 목록을 가져오는 방법"만 fetcher에 담고,
  // 실제 로딩/에러/재요청 관리는 useFetch가 공통으로 처리합니다.
  // 그래서 type(카테고리)나 currentPage가 바뀌면 자동으로 새 데이터를 받아옵니다.
  const fetcher = useCallback(() => fetchMovies(type, currentPage), [type, currentPage]);
  const { data, isLoading, error, refetch } = useFetch(fetcher, {
    errorMessage: '영화 데이터를 불러오는데 실패했습니다.',
  });

  // API 응답 전체(data)에서 화면에 필요한 값만 꺼내 둡니다.
  const movies = useMemo<Movie[]>(() => data?.results ?? [], [data]);
  const totalPages = useMemo(() => data?.total_pages ?? 1, [data]);

  const goPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return {
    movies,
    isLoading,
    error,
    currentPage,
    totalPages,
    refetch,
    goPrevPage,
    goNextPage,
  };
};
