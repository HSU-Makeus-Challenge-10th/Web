import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../api/comments";
import { QUERY_KEY } from "../../constants/key";

export default function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId }: { lpId: number; commentId: number }) =>
      deleteComment(lpId, commentId),
    onSuccess: (_, { lpId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId] });
    },
  });
}
