import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../../api/axios';

export const useLpList = (sort: 'desc' | 'asc', search?: string) => {
    return useInfiniteQuery({
        queryKey: ['lps', sort, search],
        queryFn: async ({ pageParam = undefined }) => {
            const response = await api.get(`/v1/lps`, {
                params: {
                    order: sort,
                    limit: 20,
                    cursor: pageParam,
                    search: search || undefined,
                }
            });
            return response.data.data;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage: any) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    });
};
