import axios from "axios";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { MovieFilters, MovieResponse } from "../types/movie";

interface UseFetchResult {
  data: MovieResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch(filters: MovieFilters): UseFetchResult {
  const [data, setData] = useState<MovieResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filters.query) {
      setData(null);
      return;
    }

    const controller = new AbortController();

    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<MovieResponse>(
          "/search/movie",
          {
            params: filters,
            signal: controller.signal,
          }
        );
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("영화 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [filters.query, filters.include_adult, filters.language]);

  return { data, isLoading, error };
}
