// src/hooks/mutations/usePostComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/comment.ts";
import { QUERY_KEY } from "../../constants/key";

export const usePostComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postComment(lpId, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ 
        queryKey: QUERY_KEY.lps.comments(lpId) 
      });
    },
    onError: (error) => {
      console.error("댓글 작성 실패:", error);
      alert("댓글을 작성하지 못했습니다.");
    },
  });
};