import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

export default function useGetLpDetail(lpid: number | undefined) {
  return useQuery({
    queryKey: ["lp", lpid],              
    queryFn: () => getLpDetail(lpid!),   
    enabled: !!lpid,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
