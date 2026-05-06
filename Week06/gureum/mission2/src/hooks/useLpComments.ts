import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpComments } from '../apis/lp';
import type { SortOrder } from '../types/common';
import { QUERY_KEYS } from '../constants/key';

const LIMIT = 10;

export const useLpComments = (lpId: number, order: SortOrder, enabled = true) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.lpComments, lpId, order],
    queryFn: ({ pageParam }) =>
      fetchLpComments(lpId, { cursor: pageParam as number | undefined, order, limit: LIMIT }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.nextCursor ?? undefined) : undefined,
    enabled: !!lpId && enabled,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
};
