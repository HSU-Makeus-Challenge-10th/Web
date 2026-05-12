import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLikedLpList } from "../../api/lp";

function useGetInfiniteLikedLpList(limit: number) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getLikedLpList({ cursor: pageParam, limit }),
    queryKey: [QUERY_KEY.likedLps],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLikedLpList;
