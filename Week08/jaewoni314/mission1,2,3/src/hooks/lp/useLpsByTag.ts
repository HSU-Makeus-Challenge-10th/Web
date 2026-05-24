import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpsByTag } from '../../apis/lp';
import type { GetLpsByTagParams } from '../../types/lp';

export const useLpsByTag = (params: GetLpsByTagParams, enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ['lpsByTag', params],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getLpsByTag({ ...params, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled,
  });
};
