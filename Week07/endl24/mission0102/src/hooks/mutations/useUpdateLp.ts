import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const useUpdateLp = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => updateLp(lpId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.lps.all });
      alert("성공적으로 수정되었습니다");
    },
    onError: (error) => {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    },
  });
};