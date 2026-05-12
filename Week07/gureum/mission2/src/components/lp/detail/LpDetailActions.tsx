interface LpDetailActionsProps {
  hasLiked: boolean;
  likeCount: number;
  isLikePending?: boolean;
  isAuthor: boolean;
  onToggleLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LpDetailActions = ({ hasLiked, likeCount, isLikePending = false, isAuthor, onToggleLike, onEdit, onDelete }: LpDetailActionsProps) => {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        disabled={isLikePending}
        onClick={onToggleLike}
        className="inline-flex items-center gap-1 text-2xl text-red-400 hover:scale-105 transition-transform disabled:opacity-50"
        aria-label={hasLiked ? '좋아요 취소' : '좋아요'}
      >
        <span aria-hidden="true">{hasLiked ? '♥' : '♡'}</span>
        <span className="text-base font-medium text-gray-200">{likeCount}</span>
      </button>

      {isAuthor && (
        <>
          <button 
            type="button"
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/50 rounded transition-colors text-sm"
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors text-sm"
          >
            삭제
          </button>
        </>
      )}
    </div>
  );
};

export default LpDetailActions;
