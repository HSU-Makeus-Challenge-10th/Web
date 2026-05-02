// src/hooks/useCustomFetch.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface FetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

export const useCustomFetch = <T>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // 💡 URL이 바뀌면 즉시 실행되는 효과
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false); // 새로운 요청 시 이전 에러 초기화

      try {
        const response = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (url) fetchData();
  }, [url]); // ✅ 의존성 배열에 url을 넣어 자동 재요청 조건 충족!

  return { data, isPending, isError };
};