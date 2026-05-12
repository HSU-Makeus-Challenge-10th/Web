import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLp } from "../../types/lp";
import type { ResponseMyInfo } from "../../types/auth";

export default function useDeleteLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLike(id),
    onMutate: async (lpId: number) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });

      const previousLpPost = queryClient.getQueryData<ResponseLp>([
        QUERY_KEY.lps,
        lpId,
      ]);

      const me = queryClient.getQueryData<ResponseMyInfo>([QUERY_KEY.myInfo]);
      const userId = me?.data.id;

      if (previousLpPost && userId) {
        queryClient.setQueryData<ResponseLp>([QUERY_KEY.lps, lpId], {
          ...previousLpPost,
          data: {
            ...previousLpPost.data,
            likes: previousLpPost.data.likes.filter(
              (like) => like.userId !== userId,
            ),
          },
        });
      }

      return { previousLpPost };
    },
    onError: (err, lpId, context) => {
      if (context?.previousLpPost) {
        queryClient.setQueryData([QUERY_KEY.lps, lpId], context.previousLpPost);
      }
    },
    onSettled: (data, error, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.likedLps] });
    },
  });
}
