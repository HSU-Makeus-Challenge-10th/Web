import { useState, useEffect } from 'react';
import tmdbClient from '../lib/tmdbClient';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function useCustomFetch<T>(url: string, params?: Record<string, unknown>): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // params 직렬화해서 의존성으로 사용
  const paramsKey = params ? JSON.stringify(params) : '';

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await tmdbClient.get<T>(url, {
          params,
          signal: controller.signal,
        });
        setData(response.data);
      } catch (err: unknown) {
        if ((err as { name?: string }).name === 'CanceledError') return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, paramsKey]);

  return { data, isLoading, error };
}

export default useCustomFetch;
