import { useCallback, useEffect, useRef, useState } from 'react';

type UseFetchOptions = {
  errorMessage?: string;
};

//
// - fetch 결과를 항상 `data / isLoading / error` 형태로 통일해서 반환
// - 의존성이 바뀌면 자동으로 다시 요청
// - 화면이 사라진 뒤(setState 하면 경고)에는 상태를 바꾸지 않도록 안전장치 제공
export const useFetch = <T>(
  fetcher: () => Promise<T>,
  dependencies: readonly unknown[],
  options?: UseFetchOptions
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 컴포넌트가 아직 화면에 있는지 기록합니다.
  // false면 "응답이 늦게 도착해도 setState 하지 않음"이 핵심입니다.
  const isMountedRef = useRef(true);

  // 실제 네트워크 요청 실행부.
  // - 최초 진입 시에도 사용
  // - 의존성 변경 자동 재호출에도 사용
  // - 버튼 클릭 수동 재시도(refetch)에도 같은 함수를 재사용
  const runFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextData = await fetcher();

      if (isMountedRef.current) {
        setData(nextData);
      }
    } catch (requestError) {
      console.error('데이터 요청 실패:', requestError);

      if (isMountedRef.current) {
        setError(options?.errorMessage ?? '데이터를 불러오지 못했습니다.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, options?.errorMessage]);

  useEffect(() => {
    isMountedRef.current = true;

    // dependencies 값이 바뀌면 이 effect가 다시 돌고, 자동 재요청됩니다.
    void runFetch();

    return () => {
      // 이 시점부터는 "화면에서 내려간 상태"이므로 setState를 막습니다.
      isMountedRef.current = false;
    };
  }, [runFetch, ...dependencies]);

  return {
    data,
    isLoading,
    error,
    // UI의 "다시 시도" 버튼은 이 함수만 호출하면 됩니다.
    refetch: runFetch,
  };
};
