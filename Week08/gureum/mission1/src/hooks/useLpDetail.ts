import { useQuery } from '@tanstack/react-query';
import { fetchLpDetail } from '../apis/lp';
import { QUERY_CACHE_TIME, QUERY_KEYS } from '../constants/key';

export const useLpDetail = (lpId: number, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lp, lpId],
    queryFn: () => fetchLpDetail(lpId),
    // 조건부 조회: lpId/인증 상태가 준비될 때만 요청
    enabled: !!lpId && enabled,
    staleTime: QUERY_CACHE_TIME.lp.staleTime,
    gcTime: QUERY_CACHE_TIME.lp.gcTime,
  });
};
