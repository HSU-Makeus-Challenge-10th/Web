import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../../apis/comment';
import type { UpdateCommentParams } from '../../types/comment';

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateCommentParams) => updateComment(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lpComments', variables.lpId],
      });
    },
  });
};
