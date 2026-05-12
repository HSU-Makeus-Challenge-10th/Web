export const LOCAL_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userInfo: 'userInfo',
} as const;

export const QUERY_KEYS = {
  // 동일 queryKey를 쓰면 컴포넌트 간 캐시를 공유한다.
  lps: 'lps',
  lp: 'lp',
} as const;
