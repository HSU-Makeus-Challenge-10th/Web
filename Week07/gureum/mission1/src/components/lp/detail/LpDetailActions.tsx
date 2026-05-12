interface LpDetailActionsProps {
  hasLiked: boolean;
  isAuthor: boolean;
  onToggleLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LpDetailActions = ({ hasLiked, isAuthor, onToggleLike, onEdit, onDelete }: LpDetailActionsProps) => {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onToggleLike}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded transition-colors text-sm"
      >
        {hasLiked ? '좋아요 취소' : '좋아요'}
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
