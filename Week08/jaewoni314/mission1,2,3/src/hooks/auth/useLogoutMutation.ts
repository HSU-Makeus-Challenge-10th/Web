import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../apis/auth';
import { useAuthStore } from '../../store/authStore';

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutFromStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      logoutFromStore();
      queryClient.clear();
      navigate('/login');
    },
    onError: (error) => {
      console.error('로그아웃 API 호출 실패:', error);

      logoutFromStore();
      queryClient.clear();
      navigate('/login');
    },
  });
};
