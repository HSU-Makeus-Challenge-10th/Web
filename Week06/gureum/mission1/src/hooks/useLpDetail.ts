import { useQuery } from '@tanstack/react-query';
import { fetchLpDetail } from '../apis/lp';
import { QUERY_KEYS } from '../constants/key';

export const useLpDetail = (lpId: number, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lp, lpId],
    queryFn: () => fetchLpDetail(lpId),
    // enabled: 조건이 true일 때만 패칭(예: 비로그인 시 상세 API 차단)
    enabled: !!lpId && enabled,
    // 상세는 목록보다 체감 깜빡임이 커서 fresh 시간을 충분히 준다.
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
