import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Comment } from '../../../../types/comment';
// import { useAuthStore } from '../../../store/authStore';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  // const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const isAuthor = user?.id === comment.authorId;

  // 드롭다운 외부 클릭 시 닫기
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleEdit = () => {
    console.log('수정', comment.id);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    console.log('삭제', comment.id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex gap-[1.5vw] py-[2vh] border-b border-gray-700">
      <img
        src={comment.author.avatar || '/default-avatar.png'}
        alt={comment.author.name}
        className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[1vw]">{comment.author.name}</span>
          <div className="flex items-center gap-[0.8vw]">
            <span className="text-[0.8vw] text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {/* {isAuthor && ( */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-400 hover:text-white transition-colors p-[0.3vw]"
              >
                <MoreVertical size={16} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-[3vh] bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-[0.5vh] z-10 min-w-[8vw]">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-[0.8vw] px-[1.5vw] py-[1vh] text-[0.9vw] text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-[0.8vw] px-[1.5vw] py-[1vh] text-[0.9vw] text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )}
            </div>
            {/* )} */}
          </div>
        </div>
        <p className="text-gray-300 mt-[0.5vh] text-[1vw]">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
