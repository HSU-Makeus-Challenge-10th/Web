import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useLpDetail = (lpId: string | undefined, isLoggedIn: boolean) => {
    return useQuery({
        queryKey: ['lp', lpId],
        queryFn: async () => {
            const response = await api.get(`/v1/lps/${lpId}`);
            return response.data.data;
        },
        enabled: isLoggedIn && !!lpId,
    });
};
