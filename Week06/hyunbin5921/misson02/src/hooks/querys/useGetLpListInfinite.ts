import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

export default function useGetLpListInfinite(params: Omit<PaginationDto, "cursor">) {
  const { order = "desc", limit = 25, search } = params;

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { order, limit, search, mode: "infinite" }],
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam as number | undefined, order, limit, search }),
    initialPageParam: undefined as number | undefined,
getNextPageParam: (lastPage: any) => {
  const hasNext = lastPage?.hasNext ?? lastPage?.data?.hasNext;
  const nextCursor = lastPage?.nextCursor ?? lastPage?.data?.nextCursor;
  return hasNext ? nextCursor : undefined;
},
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
