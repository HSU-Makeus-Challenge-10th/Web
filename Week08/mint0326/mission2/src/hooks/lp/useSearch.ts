import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../../api/axios';

export const useSearch = (debouncedQuery: string) => {
    const trimmedQuery = debouncedQuery.trim();

    return useInfiniteQuery({
        queryKey: ['search', trimmedQuery],
        queryFn: async ({ pageParam = undefined }) => {
            const response = await api.get(`/v1/lps`, {
                params: {
                    limit: 20,
                    cursor: pageParam,
                    search: trimmedQuery,
                }
            });
            return response.data.data;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage: { hasNext: boolean; nextCursor: number }) => lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: !!trimmedQuery,
        staleTime: 1000 * 60 * 5, // 5분 유지
        gcTime: 1000 * 60 * 10, // 10분 캐시 (v5부터 gcTime)
    });
};
