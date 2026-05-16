import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../apis/auth';
import { useAuthStore } from '../../store/authStore';

export const useDeleteUserMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutFromStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert('회원 탈퇴가 완료되었습니다.');
      logoutFromStore();
      queryClient.clear();
      navigate('/login');
    },
    onError: (error) => {
      console.error('회원 탈퇴 실패:', error);
      alert(`회원 탈퇴 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};
