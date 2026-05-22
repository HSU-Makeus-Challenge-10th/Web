import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp, type CreateLpRequest } from "../apis/lp";

export const useCreateLp = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateLpRequest) => postLp(body),
        onSuccess: () => {
            // LP 목록 캐시 무효화 → 메인 페이지 자동 새로고침
            queryClient.invalidateQueries({ queryKey: ["lps"] });
        },
        onError: (error) => {
            console.error("LP 생성 실패:", error);
        },
    });
};
