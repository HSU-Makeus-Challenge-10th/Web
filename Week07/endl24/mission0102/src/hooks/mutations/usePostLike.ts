import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto, ResponseLpDto } from "../../types/lp";
import { useAuth } from "../../context/AuthContext";

function usePostLike() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: postLike,

    onMutate: async (lp: RequestLpDto) => {
      //쿼리 키를 이전에 만든 상수로 깔끔하게 지정
      const queryKey = QUERY_KEY.lps.detail(lp.lpId);

      //진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 백업용 이전 데이터 가져오기
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>(queryKey);

      // 내 정보 가져오기;
      const userId = Number(user?.id);

      // 불변성을 지키며 업데이트 (.filter 사용)
      // 만약 캐시된 데이터가 있다면
      if (previousLpPost) {
        queryClient.setQueryData<ResponseLpDto>(queryKey, {
          ...previousLpPost,
          data: {
            ...previousLpPost.data,
            // 내 아이디와 일치하지 않는 좋아요들만 남긴다 (즉, 내 좋아요를 삭제하는 효과)
            likes: [
              ...previousLpPost.data.likes,
              {
                id: Date.now(),
                userId: userId,
                lpId: lp.lpId,
              },
            ],
          },
        });
      }

      // 에러 발생 시 사용할 백업 데이터와 키 반환
      return { previousLpPost, queryKey };
    },

    // 문법 오류 수정 (콜론 추가) & 통째로 롤백
    onError: (err, newLp, context) => {
      console.log(err, newLp);
      if (context?.previousLpPost) {
        // 아이디가 아니라, 백업해둔 객체 전체를 다시 넣어서 원상복구
        queryClient.setQueryData(context.queryKey, context.previousLpPost);
      }
    },

    // 성공/실패 무관하게 마지막엔 무조건 최신화
    onSettled: async () => {
      await queryClient.invalidateQueries({
        // lps 관련 모든 캐시를 업데이트 (목록, 상세 둘 다)
        queryKey: QUERY_KEY.lps.all,
      });
    },
  });
}

export default usePostLike;
