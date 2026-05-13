import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeLp, unlikeLp } from '../../apis/lp';
import { useAuthStore } from '../../store/authStore';
import type { Lp } from '../../types/lp';

interface UseLikeLpMutationVariables {
  lpId: number;
  isLiked: boolean;
}

export const useLikeLp = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ lpId, isLiked }: UseLikeLpMutationVariables) =>
      isLiked ? unlikeLp(lpId) : likeLp(lpId),

    onMutate: async ({ lpId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });

      const previousLp = queryClient.getQueryData<Lp>(['lp', lpId]);

      if (previousLp && user) {
        const newLikes = isLiked
          ? previousLp.likes.filter((like) => like.userId !== user.id)
          : [...previousLp.likes, { id: -1, userId: user.id, lpId }];

        const newLp = {
          ...previousLp,
          likes: newLikes,
        };
        queryClient.setQueryData(['lp', lpId], newLp);
      }

      return { previousLp };
    },

    onError: (err, { lpId }, context) => {
      console.error('좋아요 처리 실패:', err);
      if (context?.previousLp) {
        queryClient.setQueryData(['lp', lpId], context.previousLp);
      }
    },

    onSettled: (_data, _error, { lpId }) => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });
};
