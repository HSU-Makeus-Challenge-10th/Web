import { useQuery } from '@tanstack/react-query';
import { fetchLpDetail } from '../apis/lp';
import { QUERY_KEYS } from '../constants/key';

export const useLpDetail = (lpId: number, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lp, lpId],
    queryFn: () => fetchLpDetail(lpId),
    enabled: !!lpId && enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
