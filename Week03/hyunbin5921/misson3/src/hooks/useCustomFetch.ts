import { useEffect, useMemo, useState } from "react";

type Options = {
  enabled?: boolean;                                  // 조건부 요청
  params?: Record<string, string | number | boolean | null | undefined>; // 쿼리스트링
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const BASE = "https://api.themoviedb.org/3";

export function useCustomFetch<T = any>(
  path: string | null,                 // ex) "/movie/popular"
  { enabled = true, params = {}, headers = {}, method = "GET", body }: Options = {}
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: !!enabled,
    error: null,
  });

  // params 변경 시 자동 재요청을 위해 안정된 쿼리스트링 생성
  const qs = useMemo(() => {
    const s = new URLSearchParams();
    const merged = { language: "ko-KR", include_adult: false, ...params };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== null && v !== undefined) s.set(k, String(v));
    });
    const str = s.toString();
    return str ? `?${str}` : "";
  }, [params]);

  useEffect(() => {
    if (!enabled || !path) return;

    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const url = `${BASE}${path}${qs}`;
    fetch(url, {
      signal: controller.signal,
      method,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        "Content-Type": "application/json;charset=utf-8",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => setState({ data: json as T, loading: false, error: null }))
      .catch((e: any) => {
        if (e?.name === "AbortError") return;
        setState({ data: null, loading: false, error: String(e?.message ?? e) });
      });

    return () => controller.abort();
  }, [path, qs, enabled, method, body, headers]);

  return state;
}