import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../api/auth";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfo } from "../../types/auth";

export default function usePatchMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name?: string; bio?: string; avatar?: string }) =>
      patchMyInfo(body),
    onMutate: async (newMyInfo) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousMyInfo = queryClient.getQueryData<ResponseMyInfo>([
        QUERY_KEY.myInfo,
      ]);

      if (previousMyInfo) {
        queryClient.setQueryData<ResponseMyInfo>([QUERY_KEY.myInfo], {
          ...previousMyInfo,
          data: {
            ...previousMyInfo.data,
            ...newMyInfo,
          },
        });
      }

      return { previousMyInfo };
    },
    onError: (error, newMyInfo, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}
