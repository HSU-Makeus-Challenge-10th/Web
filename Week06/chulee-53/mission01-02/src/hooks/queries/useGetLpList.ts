import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../api/lp";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, { search, order }],
    queryFn: () => getLpList({ cursor, search, order, limit }),
    staleTime: 5 * 60 * 1_000,
    gcTime: 10 * 60 * 1_000,
    // enabled: Boolean(search), 검색기능
    select: (data) => data.data.data,
  });
}

export default useGetLpList;
