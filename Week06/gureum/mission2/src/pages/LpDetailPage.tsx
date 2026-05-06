import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLpDetail } from '../hooks/useLpDetail';
import { useLpComments } from '../hooks/useLpComments';
import { useAuth } from '../context/AuthContext';
import CommentSkeleton from '../components/lp/CommentSkeleton';
import type { SortOrder } from '../types/common';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

const getLikeCount = (likesCount?: number, likes?: Array<{ userId: number }>) => likesCount ?? likes?.length ?? 0;

/* ─── 로그인 필요 모달 ─── */
const LoginRequiredModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-sm w-full mx-4 text-center space-y-4">
      <h3 className="text-white text-lg font-bold">로그인이 필요합니다</h3>
      <p className="text-gray-400 text-sm">LP 상세 페이지를 보려면 로그인이 필요합니다.</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800 transition-colors text-sm"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white transition-colors text-sm"
        >
          확인
        </button>
      </div>
    </div>
  </div>
);

/* ─── LP 스켈레톤 ─── */
const LpDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-72 aspect-square bg-gray-700 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="w-2/3 h-8 bg-gray-700 rounded" />
        <div className="w-1/3 h-4 bg-gray-700 rounded" />
        <div className="w-1/4 h-4 bg-gray-700 rounded" />
        <div className="flex gap-3 pt-4">
          <div className="w-20 h-10 bg-gray-700 rounded" />
          <div className="w-16 h-10 bg-gray-700 rounded" />
          <div className="w-16 h-10 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
    <div className="mt-10 space-y-3">
      <div className="w-32 h-5 bg-gray-700 rounded" />
      <div className="bg-gray-800 rounded p-5 space-y-2">
        <div className="w-full h-4 bg-gray-700 rounded" />
        <div className="w-5/6 h-4 bg-gray-700 rounded" />
        <div className="w-4/5 h-4 bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

/* ─── 메인 ─── */
const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [commentOrder, setCommentOrder] = useState<SortOrder>('desc');
  const [commentInput, setCommentInput] = useState('');

  // 비로그인 상태 감지
  useEffect(() => {
    if (!accessToken) {
      setShowLoginModal(true);
    }
  }, [accessToken]);

  const { data, isLoading, isError, error, refetch } = useLpDetail(Number(lpId), !!accessToken);
  const lp = data?.data;

  // 댓글 무한 스크롤
  const {
    data: commentData,
    isLoading: isCommentLoading,
    isFetchingNextPage: isCommentFetchingNext,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
  } = useLpComments(Number(lpId), commentOrder, !!accessToken);

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

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: location.pathname }, replace: true });
  };

  const handleCancel = () => {
    setShowLoginModal(false);
    navigate('/', { replace: true });
  };

  const isCommentValid = commentInput.trim().length > 0;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-900 text-white">
      {/* 비로그인 모달 */}
      {showLoginModal && (
        <LoginRequiredModal onConfirm={handleLoginRedirect} onCancel={handleCancel} />
      )}

      {/* 로딩 */}
      {isLoading && <LpDetailSkeleton />}

      {/* 에러 */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-400">{(error as Error)?.message ?? '불러오기 실패'}</p>
          <button
            onClick={() => void refetch()}
            className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* LP 상세 */}
      {!isLoading && !isError && lp && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 썸네일 */}
            <div className="flex-shrink-0">
              <img
                src={lp.thumbnail ?? 'https://placehold.co/300x300/111/fff?text=LP'}
                alt={lp.title}
                className="w-full md:w-72 aspect-square object-cover rounded-lg shadow-xl"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/111/fff?text=LP'; }}
              />
            </div>

            {/* 메타 정보 */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold">{lp.title}</h1>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(lp.createdAt)}
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {getLikeCount(lp._count?.likes, lp.likes)}개의 좋아요
              </div>

              {/* 버튼 UI */}
              <div className="flex gap-3 pt-2">
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded transition-colors text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  좋아요
                </button>
                <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/50 rounded transition-colors text-sm">
                  수정
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors text-sm">
                  삭제
                </button>
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">본문</h2>
            <div className="bg-gray-800 rounded-lg p-6 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {lp.content || '내용이 없습니다.'}
            </div>
          </div>

          {/* 태그 */}
          {(lp.tags?.length ?? 0) > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {lp.tags?.map((tag) => (
                <span key={tag.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* ─── 댓글 섹션 ─── */}
          <div className="mt-12">
            {/* 댓글 헤더 + 정렬 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                댓글
                {lp._count?.comments !== undefined && (
                  <span className="ml-2 text-base text-gray-400 font-normal">
                    ({lp._count.comments})
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCommentOrder('desc')}
                  className={`px-3 py-1 text-sm rounded border transition-colors ${
                    commentOrder === 'desc'
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'border-gray-600 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => setCommentOrder('asc')}
                  className={`px-3 py-1 text-sm rounded border transition-colors ${
                    commentOrder === 'asc'
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'border-gray-600 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  오래된순
                </button>
              </div>
            </div>

            {/* 댓글 입력란 */}
            <div className="mb-6">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력해주세요..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none"
              />
              {commentInput.length > 0 && commentInput.trim().length === 0 && (
                <p className="mt-1 text-xs text-red-400">공백만으로는 댓글을 작성할 수 없습니다.</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  disabled={!isCommentValid}
                  className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
                    isCommentValid
                      ? 'bg-pink-500 hover:bg-pink-600 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  등록
                </button>
              </div>
            </div>

            {/* 초기 댓글 로딩 스켈레톤 (상단) */}
            {isCommentLoading && <CommentSkeleton count={5} />}

            {/* 댓글 목록 */}
            {!isCommentLoading && (
              <>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">첫 번째 댓글을 남겨보세요!</p>
                ) : (
                  <ul className="space-y-5">
                    {comments.map((comment) => (
                      <li key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 shrink-0">
                          {comment.author.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">{comment.author.name}</span>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 추가 댓글 로딩 스켈레톤 (하단) */}
                {isCommentFetchingNext && (
                  <div className="mt-4">
                    <CommentSkeleton count={3} />
                  </div>
                )}

                {/* 댓글 무한 스크롤 sentinel */}
                <div ref={commentSentinelRef} className="h-2" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LpDetailPage;
