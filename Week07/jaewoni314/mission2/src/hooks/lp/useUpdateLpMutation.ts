import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLp } from '../../apis/lp';
import type { UpdateLpRequest } from '../../types/lp';

export const useUpdateLpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, lpData }: { lpId: number; lpData: UpdateLpRequest }) =>
      updateLp(lpId, lpData),
    onSuccess: (_, { lpId }) => {
      alert('LP 정보가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
    onError: (error) => {
      console.error('LP 수정 실패:', error);
      alert(`LP 수정 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};
