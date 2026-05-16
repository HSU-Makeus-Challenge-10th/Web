import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER,
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [...QUERY_KEY.lps.lists(), search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    staleTime: 1 * 60 * 1_000,

    gcTime: 5 * 60 * 1_000,
  });
}

export default useGetInfiniteLpList;
