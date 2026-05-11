import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext"; 

const useGetMyInfo = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 60 * 60 * 1_000,
    gcTime: Infinity,
  });
};

export default useGetMyInfo;
