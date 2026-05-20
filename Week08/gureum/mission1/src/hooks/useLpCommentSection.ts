import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, updateComment } from '../apis/lp';
import { QUERY_KEYS } from '../constants/key';
import { useLpComments } from './useLpComments';
import type { SortOrder } from '../types/common';

export const useLpCommentSection = (lpId: number, enabled: boolean) => {
  const queryClient = useQueryClient();
  const [commentOrder, setCommentOrder] = useState<SortOrder>('desc');
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentInput, setEditingCommentInput] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useLpComments(lpId, commentOrder, enabled);

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];
  const commentSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = commentSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) void fetchNextPage();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const refreshComments = async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lpComments, lpId] });
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lp, lpId] });
  };

  const stopCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentInput('');
  };

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(lpId, { content }),
    onSuccess: async () => {
      setCommentInput('');
      await refreshComments();
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, { content }),
    onSuccess: async () => {
      stopCommentEdit();
      await refreshComments();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: refreshComments,
  });

  return {
    comments,
    commentOrder,
    commentInput,
    editingCommentId,
    editingCommentInput,
    openMenuId,
    isCommentLoading: isLoading,
    isCommentFetchingNext: isFetchingNextPage,
    isCreatingComment: createCommentMutation.isPending,
    commentSentinelRef,
    setCommentOrder,
    setCommentInput,
    setEditingCommentInput,
    setOpenMenuId,
    createComment: () => createCommentMutation.mutate(commentInput.trim()),
    startCommentEdit: (commentId: number, content: string) => {
      setEditingCommentId(commentId);
      setEditingCommentInput(content);
      setOpenMenuId(null);
    },
    stopCommentEdit,
    saveCommentEdit: (commentId: number) => updateCommentMutation.mutate({ commentId, content: editingCommentInput.trim() }),
    deleteComment: (commentId: number) => {
      deleteCommentMutation.mutate(commentId);
      setOpenMenuId(null);
    },
  };
};
