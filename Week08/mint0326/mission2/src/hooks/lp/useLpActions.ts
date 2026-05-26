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
    const { isLoggedIn, user } = useAuth();

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
        mutationFn: async (isCurrentlyLiked: boolean) => {
            if (isCurrentlyLiked) {
                await api.delete(`/v1/lps/${lpId}/likes`);
            } else {
                await api.post(`/v1/lps/${lpId}/likes`);
            }
        },
        onMutate: async (isCurrentlyLiked: boolean) => {
            const queryKey = ['lp', String(lpId)];
            await queryClient.cancelQueries({ queryKey });
            const previousLp = queryClient.getQueryData(queryKey);

            if (previousLp) {
                queryClient.setQueryData(queryKey, (old: any) => {
                    const currentLikes = old?.likes || [];
                    let newLikes;
                    if (isCurrentlyLiked) {
                        newLikes = currentLikes.filter((l: any) => l.userId !== user?.id);
                    } else {
                        const alreadyLiked = currentLikes.some((l: any) => l.userId === user?.id);
                        newLikes = alreadyLiked ? currentLikes : [...currentLikes, { userId: user?.id }];
                    }
                    return { ...old, likes: newLikes };
                });
            }
            return { previousLp };
        },
        onError: (e, __, context) => {
            console.error('좋아요 토글 실패:', e);
            const queryKey = ['lp', String(lpId)];
            if (context?.previousLp) {
                queryClient.setQueryData(queryKey, context.previousLp);
            }
            if ((e as any).response?.status !== 409) {
                alert('좋아요 처리에 실패했습니다.');
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['lp', String(lpId)] });
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

        const queryKey = ['lp', String(lpId)];
        const currentLp = queryClient.getQueryData<any>(queryKey);
        const currentLikes = currentLp?.likes || [];
        const isCurrentlyLiked = currentLp 
            ? currentLikes.some((l: any) => l.userId === user?.id)
            : isLiked;

        toggleLikeMutation.mutate(isCurrentlyLiked);
    };

    return {
        isDeleting: deleteLpMutation.isPending,
        isTogglingLike: toggleLikeMutation.isPending,
        handleDelete,
        handleLikeClick,
    };
};
