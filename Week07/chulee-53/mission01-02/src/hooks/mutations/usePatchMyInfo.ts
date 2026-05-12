import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../api/auth";
import { QUERY_KEY } from "../../constants/key";

export default function usePatchMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name?: string; bio?: string; avatar?: string }) => patchMyInfo(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}
