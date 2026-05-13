import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../apis/auth';
import type { UpdateUserRequest } from '../../types/auth/user';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(data),
    onSuccess: () => {
      alert('프로필이 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('프로필 수정 실패:', error);
      alert(`프로필 수정 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};
