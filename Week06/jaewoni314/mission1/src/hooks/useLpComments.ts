import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpComments } from '../apis/comment';

interface UseLpCommentsProps {
  lpId: number;
  order: 'asc' | 'desc';
}

export const useLpComments = ({ lpId, order }: UseLpCommentsProps) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam }) =>
      getLpComments({ lpId, cursor: pageParam, order }),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    enabled: !!lpId,
  });
};
