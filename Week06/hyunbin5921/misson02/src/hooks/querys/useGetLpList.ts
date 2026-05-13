import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

const DEFAULTS: Required<Pick<PaginationDto, "limit" | "order">> = {
  limit: 24,
  order: "desc", 
};

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  const params = { 
    cursor, 
    search, 
    order: order ?? DEFAULTS.order, 
    limit: limit ?? DEFAULTS.limit 
  };

  return useQuery({
    queryKey: [QUERY_KEY.lps, params],
    queryFn: () => getLpList(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;
