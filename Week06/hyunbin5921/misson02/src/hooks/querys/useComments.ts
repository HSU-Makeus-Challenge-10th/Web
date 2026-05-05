import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, postComment } from "../../apis/comments";

export const useComments = (lpId: number, opts?: { limit?: number; order?: "asc" | "desc" }) => {
  const limit = opts?.limit ?? 20;
  const order = opts?.order ?? "desc";

  return useInfiniteQuery({
    queryKey: ["comments", lpId, { order }],  
    queryFn: ({ pageParam }) => getComments(lpId, { cursor: pageParam, limit, order }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
};

export const useCreateComment = (lpId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postComment(lpId, { content }),
    onMutate: async (content) => {
      await qc.cancelQueries({ queryKey: ["comments", lpId] });
      const prev = qc.getQueryData<any>(["comments", lpId]);
      const fake = {
        id: Date.now(),
        lpId,
        authorId: -1,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: { id: -1, name: "나", avatar: null },
      };
      qc.setQueryData(["comments", lpId], (old: any) =>
        old
          ? {
              ...old,
              pages: [
                {
                  ...old.pages[0],
                  data: { ...old.pages[0].data, data: [fake, ...old.pages[0].data.data] },
                },
                ...old.pages.slice(1),
              ],
            }
          : old
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["comments", lpId], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });
};
