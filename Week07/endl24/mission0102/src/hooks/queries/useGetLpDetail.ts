import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { useAuth } from "../../context/AuthContext";
import { QUERY_KEY } from "../../constants/key";

export const useGetLpDetail = (lpId: string | undefined) => {
  const { accessToken } = useAuth();
  const isLoggedIn = !!accessToken;
  return useQuery({
    queryKey: QUERY_KEY.lps.detail(lpId || ""),
    queryFn: () => getLpDetail(Number(lpId)),
    enabled: isLoggedIn && !!lpId,
    staleTime: 5 * 60 * 1_000,
    gcTime: 30 * 60 * 1_000,
  });
};

