import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLp, likeLp, unlikeLp, updateLp } from '../apis/lp';
import { QUERY_KEYS } from '../constants/key';
import type { LpDetailResponse, UpdateLpRequest } from '../types/lp';

interface UseLpDetailActionsParams {
  lpId: number;
  userId?: number;
  onAfterDelete: () => void;
  onAfterEdit: () => void;
}

export const useLpDetailActions = ({ lpId, userId, onAfterDelete, onAfterEdit }: UseLpDetailActionsParams) => {
  const queryClient = useQueryClient();

  const editLpMutation = useMutation({
    mutationFn: (body: UpdateLpRequest) => updateLp(lpId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lp, lpId] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lps] });
      onAfterEdit();
    },
  });

  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lps] });
      onAfterDelete();
    },
  });

  const likeMutation = useMutation({
    mutationFn: ({ liked }: { liked: boolean }) => (liked ? unlikeLp(lpId) : likeLp(lpId)),
    onMutate: async ({ liked }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.lp, lpId] });
      const previousLp = queryClient.getQueryData<LpDetailResponse>([QUERY_KEYS.lp, lpId]);

      queryClient.setQueryData([QUERY_KEYS.lp, lpId], (current: LpDetailResponse | undefined) => {
        if (!current?.data) return current;

        const currentLikes = current.data.likes ?? [];
        const hasMyLike = userId != null && currentLikes.some((like) => like.userId === userId);

        const nextLikes = liked
          ? (userId == null ? currentLikes : currentLikes.filter((like) => like.userId !== userId))
          : (userId == null || hasMyLike ? currentLikes : [...currentLikes, { userId }]);

        return {
          ...current,
          data: {
            ...current.data,
            likes: nextLikes,
            _count: { ...current.data._count, likes: nextLikes.length },
          },
        };
      });

      return { previousLp };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousLp) queryClient.setQueryData([QUERY_KEYS.lp, lpId], context.previousLp);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lp, lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lps] });
    },
  });

  return {
    isEditingLp: editLpMutation.isPending,
    isDeletingLp: deleteLpMutation.isPending,
    isTogglingLike: likeMutation.isPending,
    editLp: (body: UpdateLpRequest) => editLpMutation.mutate(body),
    deleteLp: () => deleteLpMutation.mutate(),
    toggleLike: (liked: boolean) => likeMutation.mutate({ liked }),
  };
};
