import { useQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import type { SortOrder } from '../types/common';
import { QUERY_KEYS } from '../constants/key';

export const useLpList = (sort: SortOrder) => {
  return useQuery({
    // queryKey = 캐시 식별자(정렬값이 바뀌면 다른 캐시로 분리)
    queryKey: [QUERY_KEYS.lps, sort],
    // queryFn = 서버 상태를 가져오는 단일 진입점
    queryFn: () => fetchLpList({ order: sort, limit: 20 }),
    staleTime: 1000 * 60 * 5,   // fresh 유지 시간(짧을수록 최신성↑, 트래픽↑)
    gcTime: 1000 * 60 * 10,     // 미사용 캐시 보관 시간(길수록 재진입 깜빡임↓)
  });
};
