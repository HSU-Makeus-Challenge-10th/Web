import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto, ResponseLpDto } from "../../types/lp";
import { useAuth } from "../../context/AuthContext";

function usePostLike() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLike,

    onMutate: async (lp: RequestLpDto) => {
      //명확한 타입지정
      const targetLpId = Number(lp.lpId);

      //쿼리 키를 이전에 만든 상수로 깔끔하게 지정
      const queryKey = QUERY_KEY.lps.detail(targetLpId);

      //진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 백업용 이전 데이터 가져오기
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>(queryKey);

      // 내 정보 가져오기;
      const userId = Number(user?.id);

      queryClient.setQueryData<ResponseLpDto>(queryKey, (oldData) => {
        // 이전 데이터가 없으면 그대로 반환
        if (!oldData) return oldData;

        // 멱등성 가드: 이미 내가 좋아요를 누른 상태인지 검사
        const isAlreadyLiked = oldData.data.likes.some(
          (l) => l.userId === userId,
        );

        // 이미 눌렀다면 (더블클릭 방지) 배열을 수정하지 않고 원본 그대로 반환
        if (isAlreadyLiked) {
          return oldData;
        }

        // 누르지 않은 상태라면 안전하게 내 좋아요를 추가
        return {
          ...oldData,
          data: {
            ...oldData.data,
            likes: [
              ...oldData.data.likes,
              {
                id: Date.now(), // 프론트단에서 쓸 임시 ID
                userId: userId,
                lpId: targetLpId,
              },
            ],
          },
        };
      });

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
