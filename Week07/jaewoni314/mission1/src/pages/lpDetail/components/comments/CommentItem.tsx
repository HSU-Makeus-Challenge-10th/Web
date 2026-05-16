import { useState } from 'react';
import { User } from 'lucide-react';
import type { Comment } from '../../../../types/comment';
import { useAuthStore } from '../../../../store/authStore';
import { useUpdateComment } from '../../../../hooks/comment/useUpdateComment';
import { useDeleteComment } from '../../../../hooks/comment/useDeleteComment';
import CommentHeader from './CommentHeader';
import CommentEditInput from './CommentEditInput';

interface CommentItemProps {
  comment: Comment;
  lpId: number;
}

const CommentItem = ({ comment, lpId }: CommentItemProps) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateCommentMutation, isPending: isUpdating } =
    useUpdateComment();
  const { mutate: deleteCommentMutation, isPending: isDeleting } =
    useDeleteComment();

  const isAuthor = user?.id === comment.authorId;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (content: string) => {
    updateCommentMutation(
      {
        lpId,
        commentId: comment.id,
        content,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCommentMutation({
      lpId,
      commentId: comment.id,
    });
  };

  return (
    <div className="flex gap-[1.5vw] py-[2vh] border-b border-gray-700">
      {comment.author.avatar ? (
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <User size={20} className="text-gray-400" />
        </div>
      )}
      <div className="flex-1">
        <CommentHeader
          authorName={comment.author.name}
          createdAt={comment.createdAt}
          isAuthor={isAuthor}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {isEditing ? (
          <CommentEditInput
            initialContent={comment.content}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            isUpdating={isUpdating}
          />
        ) : (
          <p className="text-gray-300 mt-[0.5vh] text-[1vw]">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
