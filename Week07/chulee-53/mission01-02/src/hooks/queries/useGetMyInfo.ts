import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../api/auth";
import { QUERY_KEY } from "../../constants/key";

export default function useGetMyInfo() {
  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
  })
}