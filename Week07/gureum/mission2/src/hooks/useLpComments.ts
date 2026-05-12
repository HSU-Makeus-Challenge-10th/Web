import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpComments } from '../apis/lp';
import type { SortOrder } from '../types/common';
import { QUERY_CACHE_TIME, QUERY_KEYS } from '../constants/key';

const LIMIT = 10;

export const useLpComments = (lpId: number, order: SortOrder, enabled = true) => {
  return useInfiniteQuery({
    // [Mission1 - useInfiniteQuery]
    // 댓글도 data.pages로 누적되어 스크롤 시 기존 목록 + 신규 페이지가 함께 유지된다.
    // 댓글 캐시는 lpId + 정렬 기준까지 key에 포함해야 일관성이 보장된다.
    queryKey: [QUERY_KEYS.lpComments, lpId, order],
    queryFn: ({ pageParam }) =>
      fetchLpComments(lpId, { cursor: pageParam as number | undefined, order, limit: LIMIT }),
    initialPageParam: undefined as number | undefined,
    // 커서 기반은 오프셋 대비 중복/누락 가능성이 낮고 깊은 페이지 성능이 안정적이다.
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.nextCursor ?? undefined) : undefined,
    enabled: !!lpId && enabled,
    staleTime: QUERY_CACHE_TIME.comment.staleTime,
    gcTime: QUERY_CACHE_TIME.comment.gcTime,
  });
};
