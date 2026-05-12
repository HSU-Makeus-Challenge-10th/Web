import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";

export default function usePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}