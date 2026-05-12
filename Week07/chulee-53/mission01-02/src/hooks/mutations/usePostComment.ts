import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../api/comments";
import { QUERY_KEY } from "../../constants/key";

export default function usePostComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, content }: { lpId: number; content: string }) =>
      postComment(lpId, { content }),
    onSuccess: (_, { lpId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId] });
    },
  });
}
