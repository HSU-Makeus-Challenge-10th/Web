import { useState, useEffect } from 'react';
import tmdbApi, { getTmdbHeaders } from '../apis/tmdb';

const useCustomFetch = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        const controller = new AbortController();

        const fetchData = async () => {
            if (!url) return;
            
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await tmdbApi.get<T>(url, {
                    signal: controller.signal,
                    headers: getTmdbHeaders(),
                });
                if (!isCancelled) {
                    setData(response.data);
                }
            } catch (error: any) {
                if (error.name !== 'CanceledError' && !isCancelled) {
                    console.error('Fetch error:', error);
                    setIsError(true);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [url]);

    return { data, isLoading, isError };
};

export default useCustomFetch;
