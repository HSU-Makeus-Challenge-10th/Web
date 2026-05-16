import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface CommentMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const CommentMenu = ({ onEdit, onDelete, isDeleting }: CommentMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      onDelete();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white transition-colors p-[0.3vw]"
        disabled={isDeleting}
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-[3vh] bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-[0.5vh] z-10 min-w-[8vw]">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full flex items-center gap-[0.8vw] px-[1.5vw] py-[1vh] text-[0.9vw] text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Edit2 size={14} />
            수정
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-full flex items-center gap-[0.8vw] px-[1.5vw] py-[1vh] text-[0.9vw] text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 size={14} />
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
