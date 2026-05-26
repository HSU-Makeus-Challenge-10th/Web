import type { Comment } from '../../../types/lp';

interface CommentItemProps {
  comment: Comment;
  isMyComment: boolean;
  isEditing: boolean;
  isMenuOpen: boolean;
  editingValue: string;
  formatDate: (dateStr: string) => string;
  onToggleMenu: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onChangeEditingValue: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

const CommentItem = ({
  comment,
  isMyComment,
  isEditing,
  isMenuOpen,
  editingValue,
  formatDate,
  onToggleMenu,
  onStartEdit,
  onDelete,
  onChangeEditingValue,
  onCancelEdit,
  onSaveEdit,
}: CommentItemProps) => {
  return (
    <li className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 shrink-0">
        {comment.author.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{comment.author.name}</span>
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>

          {isMyComment && (
            <div className="relative">
              <button type="button" onClick={onToggleMenu} className="text-gray-400 hover:text-white px-2">
                ...
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-gray-800 border border-gray-700 rounded shadow-lg overflow-hidden">
                  <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700" onClick={onStartEdit}>
                    수정
                  </button>
                  <button type="button" className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700" onClick={onDelete}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editingValue}
              onChange={(e) => onChangeEditingValue(e.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-3 py-1 text-xs border border-gray-600 rounded" onClick={onCancelEdit}>
                취소
              </button>
              <button type="button" className="px-3 py-1 text-xs bg-pink-500 rounded" onClick={onSaveEdit}>
                저장
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
        )}
      </div>
    </li>
  );
};

export default CommentItem;
