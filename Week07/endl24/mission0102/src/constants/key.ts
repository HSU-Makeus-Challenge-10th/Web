export const LOCAL_STORAGE_KEY = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
} as const;

export const QUERY_KEY = {
  myInfo: ["myInfo"] as const, 

  lps: {
    all: ["lps"] as const, 
    lists: () => [...QUERY_KEY.lps.all, "list"] as const, 
    detail: (id: string | number) => [...QUERY_KEY.lps.all, "detail", String(id)] as const,
    comments: (id: string | number) => [...QUERY_KEY.lps.all, "comments", String(id)] as const, 
  },
} as const;