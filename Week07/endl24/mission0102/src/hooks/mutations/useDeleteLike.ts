import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import type { RequestLpDto, ResponseLpDto } from "../../types/lp";
import { useAuth } from "../../context/AuthContext"; // 💡 1. AuthContext 임포트 경로 확인!

function useDeleteLike() {
  // 훅 내부에서 useAuth를 직접 호출해서 확실하게 유저 정보 받아오기
  const { user } = useAuth(); 

  return useMutation({
    mutationFn: deleteLike,
    
    onMutate: async (lp: RequestLpDto) => {
      const queryKey = QUERY_KEY.lps.detail(lp.lpId);

      await queryClient.cancelQueries({ queryKey });

      const previousLpPost = queryClient.getQueryData<ResponseLpDto>(queryKey);

      const userId = Number(user?.id);

      if (previousLpPost) {
        queryClient.setQueryData<ResponseLpDto>(queryKey, {
          ...previousLpPost,
          data: {
            ...previousLpPost.data,
            likes: previousLpPost.data.likes.filter((like) => like.userId !== userId),
          },
        });
      } else {
        console.error(queryKey);
      }

      return { previousLpPost, queryKey };
    },

    onError: (err, newLp, context) => {
      console.log(err, newLp);
      if (context?.previousLpPost) {
        queryClient.setQueryData(context.queryKey, context.previousLpPost);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.lps.all,
      });
    },
  });
}

export default useDeleteLike;