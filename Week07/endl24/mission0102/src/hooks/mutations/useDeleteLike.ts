import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto, ResponseLpDto } from "../../types/lp";
import { useAuth } from "../../context/AuthContext"; // 💡 1. AuthContext 임포트 경로 확인!

function useDeleteLike() {
  // 훅 내부에서 useAuth를 직접 호출해서 확실하게 유저 정보 받아오기
  const { user } = useAuth()
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,

    onMutate: async (lp: RequestLpDto) => {
      const targetLpId = Number(lp.lpId);
      const queryKey = QUERY_KEY.lps.detail(targetLpId);

      await queryClient.cancelQueries({ queryKey });

      const previousLpPost = queryClient.getQueryData<ResponseLpDto>(queryKey);

      const userId = Number(user?.id);

      queryClient.setQueryData<ResponseLpDto>(queryKey, (oldData) => {
        // 이전 데이터가 없으면 그대로 반환
        if (!oldData) return oldData;

        // 내 좋아요가 캐시에 실제로 존재하는지 확인
        const isLiked = oldData.data.likes.some((l) => l.userId === userId);

        if (!isLiked) {
          return oldData;
        }

        // 좋아요가 존재한다면 내 아이디가 아닌 것들만 남겨서(필터링) 제거 효과를 줍니다.
        return {
          ...oldData,
          data: {
            ...oldData.data,
            likes: oldData.data.likes.filter((like) => like.userId !== userId),
          },
        };
      });

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
