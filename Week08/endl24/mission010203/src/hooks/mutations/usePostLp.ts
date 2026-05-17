// src/hooks/mutations/usePostLp.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";
// import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto } from "../../types/lp";

function usePostLp() {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestData: RequestLpDto) => postLp(requestData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.lps.all });
      alert("새 LP가 성공적으로 작성되었습니다!");
    },
    onError: (error) => {
      console.error("작성 실패:", error);
      alert("글 작성에 실패했습니다. 다시 시도해주세요.");
    },
  });
}

export default usePostLp;
