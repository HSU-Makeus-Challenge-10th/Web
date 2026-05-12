import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";

export default function useDeleteLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLike(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, id] });
    },
  });
}
