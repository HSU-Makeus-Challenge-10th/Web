import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import type { SortOrder } from '../types/common';
import { QUERY_KEYS } from '../constants/key';

const LIMIT = 20;

export const useLpList = (sort: SortOrder) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.lps, sort],
    queryFn: ({ pageParam }) =>
      fetchLpList({ cursor: pageParam as number | undefined, order: sort, limit: LIMIT }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.nextCursor ?? undefined) : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
