import type { SortOrder } from '../../../types/common';

interface CommentSortButtonsProps {
  order: SortOrder;
  onChange: (order: SortOrder) => void;
}

const CommentSortButtons = ({ order, onChange }: CommentSortButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('desc')}
        className={`px-3 py-1 text-sm rounded border ${order === 'desc' ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-600 text-gray-400'}`}
      >
        최신순
      </button>
      <button
        onClick={() => onChange('asc')}
        className={`px-3 py-1 text-sm rounded border ${order === 'asc' ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-600 text-gray-400'}`}
      >
        오래된순
      </button>
    </div>
  );
};

export default CommentSortButtons;
