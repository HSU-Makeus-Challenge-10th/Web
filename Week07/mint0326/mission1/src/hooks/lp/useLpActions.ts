import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

interface UseLpActionsProps {
    lpId: number | string;
    isLiked: boolean;
}

export const useLpActions = ({ lpId, isLiked }: UseLpActionsProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoggedIn } = useAuth();

    const deleteLpMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/v1/lps/${lpId}`);
        },
        onSuccess: () => {
            alert('LP가 성공적으로 삭제되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['lpList'] });
            navigate('/');
        },
        onError: (e) => {
            console.error('LP 삭제 실패:', e);
            alert('LP 삭제에 실패했습니다.');
        }
    });

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            if (isLiked) {
                await api.delete(`/v1/lps/${lpId}/likes`);
            } else {
                await api.post(`/v1/lps/${lpId}/likes`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpDetail', lpId] });
        },
        onError: (e) => {
            console.error('좋아요 토글 실패:', e);
            alert('좋아요 처리에 실패했습니다.');
        }
    });

    const handleDelete = () => {
        if (window.confirm('정말 이 LP를 삭제하시겠습니까?')) {
            deleteLpMutation.mutate();
        }
    };

    const handleLikeClick = () => {
        if (!isLoggedIn) {
            alert('로그인 후 이용해주세요.');
            navigate('/login');
            return;
        }
        toggleLikeMutation.mutate();
    };

    return {
        isDeleting: deleteLpMutation.isPending,
        isTogglingLike: toggleLikeMutation.isPending,
        handleDelete,
        handleLikeClick,
    };
};
