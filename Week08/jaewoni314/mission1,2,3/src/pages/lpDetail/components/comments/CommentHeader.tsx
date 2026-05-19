import CommentMenu from './CommentMenu';

interface CommentHeaderProps {
  authorName: string;
  createdAt: string;
  isAuthor: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const CommentHeader = ({
  authorName,
  createdAt,
  isAuthor,
  isDeleting,
  onEdit,
  onDelete,
}: CommentHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="font-bold text-sm lg:text-base truncate">{authorName}</span>
      <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
        <span className="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
          {new Date(createdAt).toLocaleDateString()}
        </span>
        {isAuthor && (
          <CommentMenu
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default CommentHeader;
