import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLPDetail, createComment, patchComment, deleteComment, patchLp, deleteLp, postLpLike, deleteLpLike } from "../apis/lp";
import { useAuth } from "../context/AuthContext";
import { Calendar, Heart, Share2, Edit, Trash2, ArrowLeft, MoreHorizontal, X, Check } from "lucide-react";
import ErrorRetry from "../components/ErrorRetry";
import { LpListSkeleton, CommentListSkeleton } from "../components/LpSkeleton";
import { useInView } from "react-intersection-observer";
import useGetInfiniteComments from "../hooks/queries/useGetInfiniteComments";
import { PAGINATION_ORDER } from "../enums/common";
import Modal from "../components/Modal";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


  const order = (searchParams.get("order") as PAGINATION_ORDER) || PAGINATION_ORDER.DESC;
  const [commentInput, setCommentInput] = useState("");

  // 댓글 수정/삭제 관련 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // LP 수정 관련 상태
  const [isEditingLp, setIsEditingLp] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);

  const handleOrderChange = (newOrder: PAGINATION_ORDER) => {
    setSearchParams({ order: newOrder });
  };

  // 비로그인 접근 제한 체크
  useEffect(() => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
    }
  }, [accessToken]);

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    navigate("/login", { state: { from: `/lp/${lpid}` } });
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
    navigate(-1);
  };

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLPDetail(lpid!),
    enabled: !!lpid && !!accessToken,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: commentData,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isPending: isCommentsPending,
    isFetching: isFetchingComments,
    isFetchingNextPage: isFetchingNextComments,
  } = useGetInfiniteComments(lpid!, 5, order);

  const { ref: commentRef, inView: commentInView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (commentInView && hasNextComments && !isFetchingComments) {
      fetchNextComments();
    }
  }, [commentInView, hasNextComments, fetchNextComments, isFetchingComments]);

  // 댓글 작성 Mutation
  const { mutate: handleCreateComment, isPending: isCreatingComment } = useMutation({
    mutationFn: () => createComment(lpid!, commentInput),
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
      alert("댓글이 등록되었습니다.");
    },
    onError: () => {
      alert("댓글 등록에 실패했습니다.");
    }
  });

  // 댓글 수정 Mutation
  const { mutate: handleUpdateComment, isPending: isUpdatingComment } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number, content: string }) =>
      patchComment(lpid!, commentId, content),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
      alert("댓글이 수정되었습니다.");
    },
    onError: () => {
      alert("댓글 수정에 실패했습니다.");
    }
  });

  // 댓글 삭제 Mutation
  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpid!, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
      alert("댓글이 삭제되었습니다.");
    },
    onError: () => {
      alert("댓글 삭제에 실패했습니다.");
    }
  });

  // LP 수정 Mutation
  const { mutate: handleUpdateLp, isPending: isUpdatingLp } = useMutation({
    mutationFn: (body: any) => patchLp(lpid!, body),
    onSuccess: () => {
      setIsEditingLp(false);
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
      alert("LP 정보가 수정되었습니다.");
    },
    onError: () => {
      alert("LP 수정에 실패했습니다.");
    }
  });

  // LP 삭제 Mutation
  const { mutate: handleDeleteLp } = useMutation({
    mutationFn: () => deleteLp(lpid!),
    onSuccess: () => {
      alert("LP가 삭제되었습니다.");
      navigate("/", { replace: true });
    },
    onError: () => {
      alert("LP 삭제에 실패했습니다.");
    }
  });

  // 좋아요 토글 Mutation
  const isLiked = data?.data?.likes?.some((like: any) => like.userId === user?.id);
  const { mutate: handleToggleLike } = useMutation({
    mutationFn: () => (isLiked ? deleteLpLike(lpid!) : postLpLike(lpid!)),
    onMutate: async () => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["lp", lpid] });

      // 2. 이전 쿼리 데이터 백업
      const previousLpData = queryClient.getQueryData(["lp", lpid]);

      // 3. 캐시 데이터 낙관적 업데이트
      queryClient.setQueryData(["lp", lpid], (old: any) => {
        if (!old) return old;
        const currentLikes = old.data?.likes || [];
        const nextLikes = isLiked
          ? currentLikes.filter((like: any) => like.userId !== user?.id)
          : [...currentLikes, { userId: user?.id }];
        return {
          ...old,
          data: {
            ...old.data,
            likes: nextLikes,
          },
        };
      });

      // 4. 백업 컨텍스트 반환
      return { previousLpData };
    },
    onError: (error, variables, context) => {
      
      if (context?.previousLpData) {
        queryClient.setQueryData(["lp", lpid], context.previousLpData);
      }
      alert("좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      // 성공/실패 여부 상관없이 쿼리 무효화로 동기화
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  const startEditingLp = (lp: any) => {
    setEditTitle(lp.title);
    setEditContent(lp.content);
    setEditThumbnail(lp.thumbnail);
    setEditTags(lp.tags || []);
    setIsEditingLp(true);
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setActiveMenuId(null);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const confirmDelete = (commentId: number) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      handleDeleteComment(commentId);
      setActiveMenuId(null);
    }
  };

  const allComments = commentData?.pages.flatMap((page) => page.data?.data || []) || [];

  if (!accessToken) {
    return (
      <Modal
        isOpen={isLoginModalOpen}
        onClose={handleLoginCancel}
        title="로그인이 필요합니다"
        onConfirm={handleLoginConfirm}
        confirmText="로그인하러 가기"
        cancelText="뒤로 가기"
      >
        해당 LP의 상세 내용을 확인하시려면 로그인이 필요합니다. <br />
        지금 로그인 페이지로 이동하시겠습니까?
      </Modal>
    );
  }

  if (isPending) {
    return <LpListSkeleton />;
  }

  if (isError) {
    return <ErrorRetry onRetry={() => refetch()} />;
  }

  const lp = data?.data;
  if (!lp) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">목록으로 돌아가기</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center items-center py-12 lg:py-0">
          <div className="relative w-full max-w-[550px] aspect-square group">
            <div className="w-full h-full rounded-full bg-[#121212] shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-spin-slow border-4 border-gray-900 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-black/20 pointer-events-none z-30" />
              {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute rounded-full border-[0.5px] border-white/5 pointer-events-none" style={{ inset: `${(i + 1) * 3}%` }} />
              ))}
              <div className="w-[40%] h-[40%] rounded-full overflow-hidden border-[5px] border-[#1a1a1a] shadow-2xl relative z-10">
                <img src={isEditingLp ? editThumbnail : (lp.thumbnail || "https://via.placeholder.com/600?text=No+Image")} alt={lp.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-5 h-5 bg-white dark:bg-gray-100 rounded-full z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            </div>
            <div className="absolute -bottom-4 right-4 z-40 flex items-center space-x-3">
              <button
                onClick={() => handleToggleLike()}
                className={`p-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-90 group/like ${
                  isLiked
                    ? "bg-pink-500 text-white"
                    : "bg-white dark:bg-gray-800 text-pink-500 hover:text-white hover:bg-pink-500"
                }`}
              >
                <Heart className={`w-6 h-6 group-active/like:scale-125 transition-transform ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button className="p-4 bg-white dark:bg-gray-800 text-purple-600 hover:text-white hover:bg-purple-600 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-90">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {isEditingLp ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  value={editThumbnail}
                  onChange={(e) => setEditThumbnail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tags (쉼표로 구분)</label>
                <input
                  type="text"
                  value={editTags.join(", ")}
                  onChange={(e) => setEditTags(e.target.value.split(",").map(t => t.trim()).filter(t => t !== ""))}
                  placeholder="예: 발라드, 명반, 2024"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditingLp(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={() => handleUpdateLp({ title: editTitle, content: editContent, thumbnail: editThumbnail, tags: editTags })}
                  disabled={isUpdatingLp}
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-all"
                >
                  {isUpdatingLp ? "저장 중..." : "수정 완료"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-4 uppercase tracking-[0.2em]">
                  <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-md">Album Detail</span>
                  <span>•</span>
                  <span className="opacity-70 font-medium">Verified LP</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">{lp.title}</h1>
                <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400 mb-10">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-sm font-semibold">{new Date(lp.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-full text-pink-600 dark:text-pink-400">
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm font-bold">{lp.likes?.length || 0}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">About this LP</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{lp.content}</p>
                  </div>
                </div>
              </div>

              {/* 본인 작성 글인 경우에만 수정/삭제 버튼 노출 */}
              {user && lp.authorId === user.id && (
                <div className="flex items-center space-x-4 pt-10 mt-auto border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => startEditingLp(lp)}
                    className="flex-1 flex items-center justify-center space-x-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/20 active:scale-[0.98] transition-all group"
                  >
                    <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>정보 수정하기</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("정말로 이 LP를 삭제하시겠습니까?")) {
                        handleDeleteLp();
                      }
                    }}
                    className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 shadow-sm hover:shadow-red-500/20 active:scale-90"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">댓글</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">이 LP에 대한 당신의 생각을 나누어보세요.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOrderChange(order === PAGINATION_ORDER.DESC ? PAGINATION_ORDER.ASC : PAGINATION_ORDER.DESC)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <span>{order === PAGINATION_ORDER.DESC ? "최신순" : "오래된순"}</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 mb-12 border border-gray-100 dark:border-gray-800">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력해주세요..."
            className="w-full h-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-gray-400">최소 2자 이상 입력해주세요.</p>
            <button
              onClick={() => handleCreateComment()}
              disabled={commentInput.length < 2 || isCreatingComment}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
            >
              {isCreatingComment ? "등록 중..." : "댓글 작성"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {isCommentsPending ? (
            <CommentListSkeleton />
          ) : (
            <>
              {allComments.map((comment: any) => {
                const isAuthor = user && comment.author?.id === user.id;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold">
                          {comment.author?.nickname?.[0] || "?"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{comment.author?.nickname}</h4>
                          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* 본인 작성 댓글인 경우에만 메뉴 버튼 표시 */}
                      {isAuthor && !isEditing && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {activeMenuId === comment.id && (
                            <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                              <button
                                onClick={() => startEditing(comment)}
                                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => confirmDelete(comment.id)}
                                className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelEditing}
                            className="flex items-center space-x-1 px-3 py-1.5 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>취소</span>
                          </button>
                          <button
                            onClick={() => handleUpdateComment({ commentId: comment.id, content: editingContent })}
                            disabled={editingContent.length < 2 || isUpdatingComment}
                            className="flex items-center space-x-1 px-4 py-1.5 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 disabled:opacity-50 transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>{isUpdatingComment ? "저장 중..." : "저장"}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    )}
                  </div>
                );
              })}
            </>
          )}
          <div ref={commentRef} className="h-10">
            {isFetchingNextComments && <CommentListSkeleton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
