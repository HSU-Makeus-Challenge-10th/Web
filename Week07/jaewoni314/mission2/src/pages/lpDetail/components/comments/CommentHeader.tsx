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
      <span className="font-bold text-[1vw]">{authorName}</span>
      <div className="flex items-center gap-[0.8vw]">
        <span className="text-[0.8vw] text-gray-400">
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
