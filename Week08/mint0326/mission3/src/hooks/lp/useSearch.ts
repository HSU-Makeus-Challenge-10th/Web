import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../../api/axios';

export const useSearch = (debouncedQuery: string) => {
    return useInfiniteQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: async ({ pageParam = undefined }) => {
            const response = await api.get(`/v1/lps`, {
                params: {
                    limit: 20,
                    cursor: pageParam,
                    search: debouncedQuery,
                }
            });
            return response.data.data;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage: any) => lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: !!debouncedQuery.trim(),
        staleTime: 1000 * 60 * 5, // 5분 유지
        gcTime: 1000 * 60 * 10, // 10분 캐시 (v5부터 gcTime)
    });
};
