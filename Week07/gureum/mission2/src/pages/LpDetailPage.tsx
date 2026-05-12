import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  createComment,
  deleteComment,
  deleteLp,
  likeLp,
  unlikeLp,
  updateComment,
  updateLp,
} from '../apis/lp';
import CommentSkeleton from '../components/lp/CommentSkeleton';
import LoginRequiredModal from '../components/lp/LoginRequiredModal';
import LpDetailSkeleton from '../components/lp/LpDetailSkeleton';
import LpFormModal from '../components/lp/LpFormModal';
import CommentComposer from '../components/lp/detail/CommentComposer';
import CommentItem from '../components/lp/detail/CommentItem';
import CommentSortButtons from '../components/lp/detail/CommentSortButtons';
import LpDetailActions from '../components/lp/detail/LpDetailActions';
import ConfirmModal from '../components/common/ConfirmModal';
import { QUERY_KEYS } from '../constants/key';
import { useAuth } from '../context/AuthContext';
import { useLpComments } from '../hooks/useLpComments';
import { useLpDetail } from '../hooks/useLpDetail';
import type { SortOrder } from '../types/common';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

const getLikeCount = (likesCount?: number, likes?: Array<{ userId: number }>) => likesCount ?? likes?.length ?? 0;

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const parsedLpId = Number(lpId);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { accessToken, userInfo } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentOrder, setCommentOrder] = useState<SortOrder>('desc');
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentInput, setEditingCommentInput] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) setShowLoginModal(true);
  }, [accessToken]);

  const { data, isLoading, isError, error, refetch } = useLpDetail(parsedLpId, !!accessToken);
  const lp = data?.data;

  const {
    data: commentData,
    isLoading: isCommentLoading,
    isFetchingNextPage: isCommentFetchingNext,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
  } = useLpComments(parsedLpId, commentOrder, !!accessToken);

  const comments = commentData?.pages.flatMap((p) => p.data.data) ?? [];
  const commentSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = commentSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextComments && !isCommentFetchingNext) {
          void fetchNextComments();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextComments, hasNextComments, isCommentFetchingNext]);

  const refreshComments = async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lpComments, parsedLpId] });
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lp, parsedLpId] });
  };

  const refreshLpAndList = async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lp, parsedLpId] });
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lps] });
  };

  const startCommentEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentInput(content);
    setOpenMenuId(null);
  };

  const stopCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentInput('');
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
    setOpenMenuId(null);
  };

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(parsedLpId, { content }),
    onSuccess: async () => {
      setCommentInput('');
      await refreshComments();
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(parsedLpId, commentId, { content }),
    onSuccess: async () => {
      stopCommentEdit();
      await refreshComments();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(parsedLpId, commentId),
    onSuccess: refreshComments,
  });

  const editLpMutation = useMutation({
    mutationFn: ({ lpId, body }: { lpId: number; body: { title: string; content: string; thumbnail: string | null; tags: string[]; published: boolean } }) =>
      updateLp(lpId, body),
    onSuccess: async () => {
      setShowEditModal(false);
      await refreshLpAndList();
    },
  });

  const deleteLpMutation = useMutation({
    mutationFn: deleteLp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lps] });
      navigate('/');
    },
  });

  const likeMutation = useMutation({
    mutationFn: ({ liked }: { liked: boolean }) => (liked ? unlikeLp(parsedLpId) : likeLp(parsedLpId)),
    onMutate: async ({ liked }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.lp, parsedLpId] });

      const previousLp = queryClient.getQueryData<typeof data>([QUERY_KEYS.lp, parsedLpId]);

      queryClient.setQueryData([QUERY_KEYS.lp, parsedLpId], (current: typeof previousLp) => {
        if (!current?.data) return current;

        const currentLikes = current.data.likes ?? [];
        const currentLikeCount = current.data._count?.likes ?? currentLikes.length;
        const nextLikes = liked
          ? currentLikes.filter((like) => like.userId !== userInfo?.id)
          : [...currentLikes, { userId: userInfo?.id ?? -1 }].filter((like) => like.userId !== -1);

        return {
          ...current,
          data: {
            ...current.data,
            likes: nextLikes,
            _count: {
              ...current.data._count,
              likes: liked ? Math.max(0, currentLikeCount - 1) : currentLikeCount + 1,
            },
          },
        };
      });

      return { previousLp };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData([QUERY_KEYS.lp, parsedLpId], context.previousLp);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lp, parsedLpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lps] });
    },
  });

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: location.pathname }, replace: true });
  };

  const handleCancel = () => {
    setShowLoginModal(false);
    navigate('/', { replace: true });
  };

  const isCommentValid = commentInput.trim().length > 0;
  const isAuthor = !!userInfo && !!lp && userInfo.id === lp.authorId;
  const hasLiked = !!userInfo && !!lp?.likes?.some((like) => like.userId === userInfo.id);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-900 text-white">
      {showLoginModal && <LoginRequiredModal onConfirm={handleLoginRedirect} onCancel={handleCancel} />}
      {isLoading && <LpDetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-400">{(error as Error)?.message ?? '불러오기 실패'}</p>
          <button onClick={() => void refetch()} className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded">
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && lp && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-300 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
          >
            <span aria-hidden="true">←</span>
            뒤로가기
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={lp.thumbnail ?? 'https://placehold.co/300x300/111/fff?text=LP'}
                alt={lp.title}
                className="w-full md:w-72 aspect-square object-cover rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x300/111/fff?text=LP';
                }}
              />
            </div>

            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold">{lp.title}</h1>
              <p className="text-gray-400 text-sm">{formatDate(lp.createdAt)}</p>
              <p className="text-gray-400 text-sm">{getLikeCount(lp._count?.likes, lp.likes)}개의 좋아요</p>
              <LpDetailActions
                hasLiked={hasLiked}
                isAuthor={isAuthor}
                onToggleLike={() => likeMutation.mutate({ liked: hasLiked })}
                onEdit={() => setShowEditModal(true)}
                onDelete={() => setShowDeleteConfirm(true)}
              />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">본문</h2>
            <div className="bg-gray-800 rounded-lg p-6 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {lp.content || '내용이 없습니다.'}
            </div>
          </div>

          {(lp.tags?.length ?? 0) > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {lp.tags?.map((tag) => (
                <span key={tag.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">댓글</h2>
              <CommentSortButtons order={commentOrder} onChange={setCommentOrder} />
            </div>

            <CommentComposer
              value={commentInput}
              isValid={isCommentValid}
              isPending={createCommentMutation.isPending}
              onChange={setCommentInput}
              onSubmit={() => createCommentMutation.mutate(commentInput.trim())}
            />

            {isCommentLoading && <CommentSkeleton count={5} />}

            {!isCommentLoading && (
              <>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">첫 번째 댓글을 남겨보세요!</p>
                ) : (
                  <ul className="space-y-5">
                    {comments.map((comment) => {
                      const isMyComment = userInfo?.id === comment.authorId;
                      const isEditing = editingCommentId === comment.id;

                      return (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          isMyComment={isMyComment}
                          isEditing={isEditing}
                          isMenuOpen={openMenuId === comment.id}
                          editingValue={editingCommentInput}
                          formatDate={formatDate}
                          onToggleMenu={() => setOpenMenuId((prev) => (prev === comment.id ? null : comment.id))}
                          onStartEdit={() => startCommentEdit(comment.id, comment.content)}
                          onDelete={() => handleDeleteComment(comment.id)}
                          onChangeEditingValue={setEditingCommentInput}
                          onCancelEdit={stopCommentEdit}
                          onSaveEdit={() => updateCommentMutation.mutate({ commentId: comment.id, content: editingCommentInput.trim() })}
                        />
                      );
                    })}
                  </ul>
                )}

                {isCommentFetchingNext && (
                  <div className="mt-4">
                    <CommentSkeleton count={3} />
                  </div>
                )}

                <div ref={commentSentinelRef} className="h-2" />
              </>
            )}
          </div>
        </div>
      )}

      {lp && (
        <LpFormModal
          isOpen={showEditModal}
          title="LP 수정"
          submitLabel="수정 저장"
          isSubmitting={editLpMutation.isPending}
          initialValues={{
            title: lp.title,
            content: lp.content,
            thumbnail: lp.thumbnail,
            tags: lp.tags?.map((tag) => tag.name) ?? [],
          }}
          onClose={() => setShowEditModal(false)}
          onSubmit={(values) => editLpMutation.mutate({ lpId: parsedLpId, body: values })}
        />
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        title="LP를 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        loading={deleteLpMutation.isPending}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteLpMutation.mutate(parsedLpId);
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
};

export default LpDetailPage;
