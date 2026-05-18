import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPComments } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";

function useGetInfiniteComments(
    lpId: string | number,
    limit: number,
    order: PAGINATION_ORDER,
) {
    return useInfiniteQuery({
        queryFn: ({ pageParam = undefined }) => getLPComments(lpId, {
            cursor: pageParam,
            limit,
            order,
        }),
        queryKey: ["lpComments", lpId, order],
        initialPageParam: 0,
        getNextPageParam: (lastPage: any) => {
            console.log("[useGetInfiniteComments] lastPage:", lastPage);
            if (!lastPage?.data) return undefined;
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        enabled: !!lpId,
    });
}

export default useGetInfiniteComments;
