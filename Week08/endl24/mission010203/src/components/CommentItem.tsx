import { useState } from "react";
import { useCommentMutations } from "../hooks/mutations/useCommentMutations";

export interface CommentType {
  id: number;
  content: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
  };
}

interface CommentItemProps {
  lpId: number;
  comment: CommentType; 
  currentUserId?: number; 
  postAuthorId?: number;
}

export const CommentItem = ({
  lpId,
  comment,
  currentUserId,
  postAuthorId,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { updateMutation, deleteMutation } = useCommentMutations(lpId);

  const isMine = comment.authorId === currentUserId;
  const isPostAuthor = comment.authorId === postAuthorId;

  const handleUpdate = () => {
    updateMutation.mutate(
      { commentId: comment.id, content: editContent },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleDelete = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteMutation.mutate(comment.id);
    }
  };

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      <div
        className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm
        ${isPostAuthor ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}
      `}
      >
        {comment.author.name?.[0] || "U"}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-gray-900">
              {comment.author.name}
            </span>
            {isPostAuthor && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full">
                작성자
              </span>
            )}
            {isMine && !isPostAuthor && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded-full">
                나
              </span>
            )}
          </div>
          {isMine && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-gray-400 hover:text-indigo-600"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1 bg-gray-100 rounded"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="text-xs px-3 py-1 bg-indigo-600 text-white rounded"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mt-1 text-sm leading-relaxed">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};
