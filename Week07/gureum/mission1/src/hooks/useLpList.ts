import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import type { SortOrder } from '../types/common';
import { QUERY_CACHE_TIME, QUERY_KEYS } from '../constants/key';

const LIMIT = 20;

export const useLpList = (sort: SortOrder) => {
  return useInfiniteQuery({
    // [Mission1 - useInfiniteQuery]
    // 목록 무한스크롤: queryKey + pageParam(cursor) 조합으로 페이지를 누적 캐시한다.
    // queryKey에 정렬값을 포함해 캐시 분리(최신순/오래된순 동시 유지)
    queryKey: [QUERY_KEYS.lps, sort],
    queryFn: ({ pageParam }) =>
      fetchLpList({ cursor: pageParam as number | undefined, order: sort, limit: LIMIT }),
    // 커서 기반 페이지네이션: 첫 요청은 cursor 없음
    initialPageParam: undefined as number | undefined,
    // getNextPageParam이 다음 cursor를 반환하면 hasNextPage=true가 되어 fetchNextPage 가능
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.nextCursor ?? undefined) : undefined,
    // staleTime/gcTime으로 fresh 유지와 캐시 보관 기간을 분리 설계
    staleTime: QUERY_CACHE_TIME.lp.staleTime,
    gcTime: QUERY_CACHE_TIME.lp.gcTime,
  });
};
