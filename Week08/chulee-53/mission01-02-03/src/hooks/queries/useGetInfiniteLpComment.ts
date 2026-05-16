import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpComment } from "../../api/comments";
import type { PaginationDto } from "../../types/common";

function useGetInfiniteLpComment(lpId: number, paginationDto: PaginationDto) {
  const { limit, order } = paginationDto;
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpComment(lpId, { cursor: pageParam, limit, order }),
    queryKey: [QUERY_KEY.lpComments, lpId, order, limit],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpComment;
