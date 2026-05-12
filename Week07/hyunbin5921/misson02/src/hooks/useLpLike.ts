import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LpItem, Likes } from "../types/lp"; // Likes 타입 추가 임포트
import { addLpLike, removeLpLike } from "../apis/lp";
import { useAuth } from "../context/AuthContext"; // 🚨 userId를 가져오기 위해 AuthContext 사용 가정

export const useToggleLpLike = (lpId: number) => {
  const queryClient = useQueryClient();
  const { userId } = useAuth(); // 현재 로그인된 userId 가져오기
  const queryKey = ["lpDetail", lpId];

  const currentUserId = userId; // number | null

  // 1. 좋아요 추가 뮤테이션 (POST)
  const addLikeMutation = useMutation({
    mutationFn: () => addLpLike(lpId),

    onMutate: async () => {
      if (currentUserId === null) throw new Error("로그인이 필요합니다.");

      await queryClient.cancelQueries({ queryKey });
      const previousLpDetail = queryClient.getQueryData<LpItem>(queryKey);

      queryClient.setQueryData<LpItem>(queryKey, (old) => {
        if (!old) return old;

        // 🚨 낙관적 업데이트: likes 배열에 새로운 좋아요 객체 추가
        const newLike: Likes = {
          id: Date.now(), // 임시 ID
          userId: currentUserId,
          lpId: old.id,
        };

        // 이미 좋아요를 누른 상태라면 중복 추가 방지 (방어적 코드)
        if (old.likes.some((like) => like.userId === currentUserId)) {
          return old;
        }

        return {
          ...old,
          likes: [...old.likes, newLike],
        };
      });

      return { previousLpDetail };
    },

    onError: (err, variables, context) => {
      if (context?.previousLpDetail) {
        queryClient.setQueryData(queryKey, context.previousLpDetail);
      }
      console.error("좋아요 추가 실패. 롤백 실행됨:", err);
    },

    // onSettled는 서버 상태로 최종 동기화 (refetch)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 2. 좋아요 취소 뮤테이션 (DELETE)
  const removeLikeMutation = useMutation({
    mutationFn: () => removeLpLike(lpId),

    onMutate: async () => {
      if (currentUserId === null) throw new Error("로그인이 필요합니다.");

      await queryClient.cancelQueries({ queryKey });
      const previousLpDetail = queryClient.getQueryData<LpItem>(queryKey);

      queryClient.setQueryData<LpItem>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          // 🚨 낙관적 업데이트: likes 배열에서 현재 사용자의 좋아요 객체 제거
          likes: old.likes.filter((like) => like.userId !== currentUserId),
        };
      });
      return { previousLpDetail };
    },

    onError: (err, variables, context) => {
      if (context?.previousLpDetail) {
        queryClient.setQueryData(queryKey, context.previousLpDetail);
      }
      console.error("좋아요 취소 실패. 롤백 실행됨:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isAdding: addLikeMutation.isPending,
    isRemoving: removeLikeMutation.isPending,
    addLikeAsync: addLikeMutation.mutateAsync, // 🚨 수정: mutateAsync 반환
    removeLikeAsync: removeLikeMutation.mutateAsync, // 🚨 수정: mutateAsync 반환
  };
};
