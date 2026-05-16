import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment, deleteComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

export const useCommentMutations = (lpId: number) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => 
      updateComment(lpId, commentId, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY.lps.comments(lpId) }),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY.lps.comments(lpId) }),
  });

  return { updateMutation, deleteMutation };
};