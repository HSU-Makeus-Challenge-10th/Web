import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../apis/comment';
import type { DeleteCommentParams } from '../../types/comment';

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteCommentParams) => deleteComment(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lpComments', variables.lpId],
      });
    },
  });
};
