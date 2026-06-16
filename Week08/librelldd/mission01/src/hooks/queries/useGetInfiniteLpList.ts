import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPList } from "../../apis/lp.ts";
import { PAGINATION_ORDER } from "../../enums/common.ts"
import { QUERY_KEY } from "../../constants/key.ts";
import type { ResponseLpListDto } from "../../types/lp.ts";

function useGetInfiniteLpList(
    limit: number,
    search: string,
    order: PAGINATION_ORDER,
) {
    return useInfiniteQuery({
        queryFn: ({ pageParam = undefined }) => getLPList({
            cursor: pageParam,
            limit,
            search,
            order,
        }),

        queryKey: [QUERY_KEY.lps, search, order],
        initialPageParam: 0,

        enabled: search === "" || search.trim().length > 0,

        getNextPageParam: (lastPage: ResponseLpListDto, allPages: ResponseLpListDto[]) => {
            console.log("lastPage", allPages);
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },

        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })
}

export default useGetInfiniteLpList;