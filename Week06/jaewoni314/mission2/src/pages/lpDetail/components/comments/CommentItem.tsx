import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Comment } from '../../../../types/comment';
import { useAuthStore } from '../../../../store/authStore';
import { PrivateAPI } from '../../../../apis/axios';
import { useQueryClient } from '@tanstack/react-query';

interface CommentItemProps {
  comment: Comment;
  lpId: number;
  order: 'asc' | 'desc';
}

const CommentItem = ({ comment, lpId, order }: CommentItemProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthor = user?.id === comment.authorId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleEdit = () => {
    setIsDropdownOpen(false);
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    try {
      await PrivateAPI.patch(`v1/lps/${lpId}/comments/${comment.id}`, {
        content: editContent,
      });
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, order] });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    setIsDropdownOpen(false);
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await PrivateAPI.delete(`v1/lps/${lpId}/comments/${comment.id}`);
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, order] });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex gap-3 py-[2vh] border-b border-gray-700">
      {/* ✅ 고정 크기 아바타 */}
      <img
        src={comment.author.avatar ?? 'default-avatar.png'}
        alt={comment.author.name}
        className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">{comment.author.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {isAuthor && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <MoreVertical size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-24">
                    <button
                      onClick={handleEdit}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} /> 수정
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 수정 모드 */}
        {isEditing ? (
          <div className="flex gap-2 mt-1">
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 bg-gray-800 text-white rounded px-3 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button
              onClick={handleEditSubmit}
              className="text-pink-400 hover:text-pink-300 text-sm whitespace-nowrap"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-white text-sm whitespace-nowrap"
            >
              취소
            </button>
          </div>
        ) : (
          <p className="text-gray-300 mt-1 text-sm">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;