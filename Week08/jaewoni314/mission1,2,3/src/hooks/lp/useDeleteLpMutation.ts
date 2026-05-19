import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteLp } from '../../apis/lp';

export const useDeleteLpMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      alert('LP가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('LP 삭제 실패:', error);
      alert(`LP 삭제 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};
