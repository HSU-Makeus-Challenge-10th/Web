export const LOCAL_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userInfo: 'userInfo',
} as const;

export const QUERY_KEYS = {
  // 동일 queryKey를 쓰면 컴포넌트 간 캐시를 공유한다.
  lps: 'lps',
  lp: 'lp',
  // 무한 스크롤 댓글은 lpId + 정렬값까지 key에 포함해 캐시 충돌을 방지한다.
  lpComments: 'lpComments',
} as const;

export const QUERY_CACHE_TIME = {
  // QueryClient 기본 정책
  default: {
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  },
  // LP 목록/상세
  lp: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  },
  // 댓글
  comment: {
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  },
} as const;
