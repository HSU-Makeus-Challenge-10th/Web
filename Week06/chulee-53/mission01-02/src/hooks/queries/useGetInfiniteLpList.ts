import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../api/lp";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: "asc" | "desc",
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;
