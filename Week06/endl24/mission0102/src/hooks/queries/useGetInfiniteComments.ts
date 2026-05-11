import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";

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

export const useGetInfiniteComments = (lpId: number, order: PAGINATION_ORDER) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam }) => getComments({ pageParam: pageParam as number, lpId, order }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.meta.hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: !!lpId,
  });
};