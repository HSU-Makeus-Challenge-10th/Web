import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../types/common";
import { getLPList } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";
import { PAGINATION_ORDER } from "../enums/common"; // Enum 임포트 확인

// 1. 타입을 확장합니다.
interface GetLpListParams extends PaginationDto {
    sort?: PAGINATION_ORDER;
}

// 2. 확장한 타입을 매개변수에 적용합니다.
function useGetLpList({ cursor, search, sort, limit }: GetLpListParams) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, search, sort],
        queryFn: () =>
            getLPList({
                cursor,
                search,

                limit,
            }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 3,
    });
}

export default useGetLpList;