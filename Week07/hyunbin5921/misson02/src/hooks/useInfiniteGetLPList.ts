// src/hooks/useInfiniteGetLPList.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp"; // LP 목록 API 호출 함수
import type { CursorBasedResponse } from "../types/common";
import { PAGINATION_ORDER } from "../types/common"; // enum은 값으로도 사용되므로 일반 임포트
import type { LpItem } from "../types/lp";

// API 응답 타입 정의
type LPListResponse = CursorBasedResponse<LpItem[]>;

interface Props {
  limit: number;
  search: string;
  order: PAGINATION_ORDER;
}

export const useInfiniteGetLpList = ({ limit, search, order }: Props) => {
  // useInfiniteQuery에 제네릭 타입 명시
  return useInfiniteQuery<LPListResponse, Error, LPListResponse>({
    queryKey: ["lpList", search, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({
        cursor: pageParam as number, // pageParam을 현재 커서로 사용
        limit,
        search,
        order,
      }),
    initialPageParam: 0, // 0부터 시작

    getNextPageParam: (lastPage) => {
      const cursorData = lastPage.data;

      if (cursorData?.hasNext) {
        return cursorData.nextCursor;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
