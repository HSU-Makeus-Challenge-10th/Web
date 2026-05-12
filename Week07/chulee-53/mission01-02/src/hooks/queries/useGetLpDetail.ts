import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../api/lp";

function useGetLpDetail(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, id],
    queryFn: () => getLpDetail(id),
    staleTime: 5 * 60 * 1_000,
    gcTime: 10 * 60 * 1_000,
  });
}

export default useGetLpDetail;
