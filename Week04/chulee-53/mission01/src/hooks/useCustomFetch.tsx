import { useEffect, useState } from "react";
import axios from "axios";

export default function useCustomFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [pending, setPending] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!url) {
                setError(true);
                setPending(false);
                return;
            }

            setPending(true);
            setError(false);
            try {
                const response = await axios.get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setPending(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, pending, error };
}