import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common.js";
import { QUERY_KEY } from "../../constants/key";
import {
  getLpList,
  getLpDetail,
  getLpListByUser,
  getMyLpList,
  createLp,
  deleteLp,
} from "../../apis/lp.js";
import type { CreateLpDto } from "../../types/lp.js";

// 1. 전체 LP 목록 조회 Hook (HomePage용)
export const useGetLpList = (paginationDto: PaginationDto) => {
  return useQuery({
    queryKey: [QUERY_KEY.lps, "all", paginationDto],
    queryFn: () => getLpList(paginationDto),
  });
};

// 2. Lp 상세 정보 조회 Hook
export const useGetLpDetail = (lpId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpDetail(lpId),
    enabled: !!lpId, // lpId가 있을 때만 쿼리 실행
  });
};

// 3. Lp 생성 Mutation Hook
export const useCreateLp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lpData: CreateLpDto) => createLp(lpData),
    onSuccess: () => {
      // 생성 성공 시, 전체 목록 쿼리 무효화하여 새로고침 유도
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, "all"] });
    },
    onError: (error) => {
      console.error("Lp 생성 실패:", error);
      // 추가적인 에러 처리 로직 (e.g., 토스트 메시지 표시)
    },
  });
};

// 4. Lp 삭제 Mutation Hook
export const useDeleteLp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      // 삭제 성공 시, 전체 목록 쿼리 및 해당 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
};
