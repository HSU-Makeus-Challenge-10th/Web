import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";
// import type { ResponseLpListDto } from "../../types/lp"; // 쓰고 있으면 이렇게 제네릭도 줄 수 있음

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PaginationDto["order"] = "desc" // 기본값 최신순
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order, limit],
    // pageParam 기본값 0으로 명시
    queryFn: ({ pageParam = 0 }) =>
      getLpList({
        cursor: pageParam,
        limit,
        search,
        order,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}

export default useGetInfiniteLpList;
    