import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../apis/auth';
import type { UpdateUserRequest } from '../../types/auth/user';
import { useAuthStore } from '../../store/authStore';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(data),
    onMutate: async (newUserData) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });

      const previousUser = user;

      if (previousUser) {
        setUser({ ...previousUser, ...newUserData });
      }

      return { previousUser };
    },
    onSuccess: () => {
      alert('프로필이 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err, _newUser, context) => {
      console.error('프로필 수정 실패:', err);
      alert(`프로필 수정 중 오류가 발생했습니다: ${err.message}`);
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
