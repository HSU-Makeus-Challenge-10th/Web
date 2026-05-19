import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../apis/comment';
import type { CreateCommentParams } from '../../types/comment';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) => createComment(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lpComments', variables.lpId],
      });
    },
  });
};
