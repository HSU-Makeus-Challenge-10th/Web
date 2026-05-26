import type React from 'react';
import type { RefObject } from 'react';
import CommentComposer from './CommentComposer';
import CommentItem from './CommentItem';
import CommentSortButtons from './CommentSortButtons';
import LpDetailActions from './LpDetailActions';
import CommentSkeleton from '../CommentSkeleton';
import type { Comment, Lp } from '../../../types/lp';
import type { SortOrder } from '../../../types/common';

interface LpDetailContentProps {
  lp: Lp;
  userId?: number;
  hasLiked: boolean;
  isAuthor: boolean;
  isTogglingLike: boolean;
  commentOrder: SortOrder;
  isCommentValid: boolean;
  commentInput: string;
  isCreatingComment: boolean;
  isCommentLoading: boolean;
  comments: Comment[];
  editingCommentId: number | null;
  openMenuId: number | null;
  editingCommentInput: string;
  isCommentFetchingNext: boolean;
  commentSentinelRef: RefObject<HTMLDivElement | null>;
  setCommentOrder: (order: SortOrder) => void;
  setCommentInput: React.Dispatch<React.SetStateAction<string>>;
  setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingCommentInput: React.Dispatch<React.SetStateAction<string>>;
  onBack: () => void;
  onToggleLike: () => void;
  onEditLp: () => void;
  onDeleteLp: () => void;
  onCreateComment: () => void;
  onStartCommentEdit: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
  onCancelCommentEdit: () => void;
  onSaveCommentEdit: (commentId: number) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

const getLikeCount = (likesCount?: number, likes?: Array<{ userId: number }>) => likesCount ?? likes?.length ?? 0;

const LpDetailContent = ({
  lp,
  userId,
  hasLiked,
  isAuthor,
  isTogglingLike,
  commentOrder,
  isCommentValid,
  commentInput,
  isCreatingComment,
  isCommentLoading,
  comments,
  editingCommentId,
  openMenuId,
  editingCommentInput,
  isCommentFetchingNext,
  commentSentinelRef,
  setCommentOrder,
  setCommentInput,
  setOpenMenuId,
  setEditingCommentInput,
  onBack,
  onToggleLike,
  onEditLp,
  onDeleteLp,
  onCreateComment,
  onStartCommentEdit,
  onDeleteComment,
  onCancelCommentEdit,
  onSaveCommentEdit,
}: LpDetailContentProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-300 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
        <span aria-hidden="true">←</span>
        뒤로가기
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img src={lp.thumbnail ?? 'https://placehold.co/300x300/111/fff?text=LP'} alt={lp.title} className="w-full md:w-72 aspect-square object-cover rounded-lg shadow-xl" onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/111/fff?text=LP'; }} />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{lp.title}</h1>
          <p className="text-gray-400 text-sm">{formatDate(lp.createdAt)}</p>
          <LpDetailActions
            hasLiked={hasLiked}
            likeCount={getLikeCount(lp._count?.likes, lp.likes)}
            isLikePending={isTogglingLike}
            isAuthor={isAuthor}
            onToggleLike={onToggleLike}
            onEdit={onEditLp}
            onDelete={onDeleteLp}
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">본문</h2>
        <div className="bg-gray-800 rounded-lg p-6 text-gray-300 leading-relaxed whitespace-pre-wrap">{lp.content || '내용이 없습니다.'}</div>
      </div>

      {(lp.tags?.length ?? 0) > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {lp.tags?.map((tag) => <span key={tag.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">#{tag.name}</span>)}
        </div>
      )}

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">댓글</h2>
          <CommentSortButtons order={commentOrder} onChange={setCommentOrder} />
        </div>

        <CommentComposer value={commentInput} isValid={isCommentValid} isPending={isCreatingComment} onChange={setCommentInput} onSubmit={onCreateComment} />
        {isCommentLoading && <CommentSkeleton count={5} />}

        {!isCommentLoading && (
          <>
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">첫 번째 댓글을 남겨보세요!</p>
            ) : (
              <ul className="space-y-5">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    isMyComment={userId === comment.authorId}
                    isEditing={editingCommentId === comment.id}
                    isMenuOpen={openMenuId === comment.id}
                    editingValue={editingCommentInput}
                    formatDate={formatDate}
                    onToggleMenu={() => setOpenMenuId((prev) => (prev === comment.id ? null : comment.id))}
                    onStartEdit={() => onStartCommentEdit(comment.id, comment.content)}
                    onDelete={() => onDeleteComment(comment.id)}
                    onChangeEditingValue={setEditingCommentInput}
                    onCancelEdit={onCancelCommentEdit}
                    onSaveEdit={() => onSaveCommentEdit(comment.id)}
                  />
                ))}
              </ul>
            )}

            {isCommentFetchingNext && <div className="mt-4"><CommentSkeleton count={3} /></div>}
            <div ref={commentSentinelRef} className="h-2" />
          </>
        )}
      </div>
    </div>
  );
};

export default LpDetailContent;
