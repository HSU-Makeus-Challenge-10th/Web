import { useQuery } from '@tanstack/react-query';

const STALE_TIME = 5 * 60 * 1000; // 5분

export const useCustomFetch = <T>(url: string) => {
  return useQuery<T, Error>({
    queryKey: ['fetch', url],
    queryFn: async ({ signal }): Promise<T> => {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      return response.json() as Promise<T>;
    },
    staleTime: STALE_TIME,
  });
};
