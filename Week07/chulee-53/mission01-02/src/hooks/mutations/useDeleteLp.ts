import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";

export default function useDeleteLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}
