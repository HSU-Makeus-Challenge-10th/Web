import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComment } from "../../api/comments";
import { QUERY_KEY } from "../../constants/key";

export default function usePatchComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lpId,
      commentId,
      content,
    }: {
      lpId: number;
      commentId: number;
      content: string;
    }) => patchComment(lpId, commentId, { content }),
    onSuccess: (_, { lpId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId] });
    },
  });
}
