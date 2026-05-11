import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useLpComments = (lpId: string | undefined, sort: 'desc' | 'asc', isLoggedIn: boolean) => {
    const queryClient = useQueryClient();

    const commentsQuery = useInfiniteQuery({
        queryKey: ['lpComments', lpId, sort],
        queryFn: async ({ pageParam = undefined }) => {
            // 💡 로컬 환경이라 응답이 너무 빨라서 스켈레톤이 안 보이는 것을 막기 위해 1.5초 딜레이 추가
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await api.get(`/v1/lps/${lpId}/comments`, {
                params: {
                    order: sort,
                    limit: 10,
                    cursor: pageParam,
                }
            });
            return response.data.data;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage: any) => lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: isLoggedIn && !!lpId,
    });

    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            await api.post(`/v1/lps/${lpId}/comments`, { content });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, sort] });
        },
        onError: (e) => {
            console.error('댓글 작성 실패:', e);
            alert('댓글 작성에 실패했습니다.');
        }
    });

    return {
        ...commentsQuery,
        addComment: addCommentMutation.mutateAsync,
        isSubmitting: addCommentMutation.isPending,
    };
};
