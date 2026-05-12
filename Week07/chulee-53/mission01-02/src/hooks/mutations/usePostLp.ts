import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateLp } from "../../types/lp";

export default function usePostLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestCreateLp) => postLp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}
