import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

interface GetCommentsParams {
  pageParam?: number;
  lpId: number;
  order: PAGINATION_ORDER;
}

const getComments = async ({ pageParam = 1, lpId, order }: GetCommentsParams) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { 
      page: pageParam, 
      limit: 10, 
      order 
    },
  });
  return data;
};

export const useGetInfiniteComments = (lpId: number, order: PAGINATION_ORDER, isLoggedIn: boolean) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEY.lps.comments(lpId || ""), order],
    queryFn: ({ pageParam }) => getComments({ pageParam: pageParam as number, lpId, order }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.meta) return undefined;
      return lastPage.data.meta.hasNextPage ? lastPage.data.meta.page + 1 : undefined;
    },
    enabled: isLoggedIn && !!lpId,

    staleTime: 10 * 1_000, 

    gcTime: 5 * 60 * 1_000,
  });
};