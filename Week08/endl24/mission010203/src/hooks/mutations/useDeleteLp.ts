// src/hooks/mutations/useDeleteLp.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { useNavigate } from "react-router-dom";

export const useDeleteLp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: async () => {
      navigate("/", { replace: true });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.lps.all });

      alert("삭제되었습니다.");
    },
    onError: (error) => {
      console.error("삭제 실패:", error);
      alert("삭제 중에 문제가 발생했습니다.");
    },
  });
};
