import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lp';
import type { GetLpsParams } from '../types/lp';

export const useLps = (params: GetLpsParams) => {
  return useInfiniteQuery({
    queryKey: ['lps', params],
    queryFn: ({ pageParam }) => getLps({ ...params, cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
