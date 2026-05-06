import { useQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import type { SortOrder } from '../types/common';
import { QUERY_KEYS } from '../constants/key';

export const useLpList = (sort: SortOrder) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lps, sort],
    queryFn: () => fetchLpList({ order: sort, limit: 20 }),
    staleTime: 1000 * 60 * 5,   // 5분 동안 fresh 유지
    gcTime: 1000 * 60 * 10,     // 10분 후 캐시 제거
  });
};
