import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../../apis/lp';
import type { Lp } from '../../types/lp';

const useLpDetail = (lpId: number) => {
  return useQuery<Lp, Error>({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(lpId),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

export default useLpDetail;
