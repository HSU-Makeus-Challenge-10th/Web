import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../../apis/lp';
import type { GetLpsParams } from '../../types/lp';

export const useLps = (params: GetLpsParams, enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ['lps', params],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getLps({ ...params, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled,
  });
};
