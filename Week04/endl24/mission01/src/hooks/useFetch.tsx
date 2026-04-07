import { useState, useEffect } from "react";
import axios from "axios";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setIsError(true);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErrorMsg("요청하신 정보를 찾을 수 없습니다. (404)");
          } else if (error.response?.status === 500) {
            setErrorMsg(
              "서버에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. (500)",
            );
          } else {
            setErrorMsg("데이터를 가져오는 중 문제가 발생했습니다.");
          }
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isPending, isError, errorMsg };
}
