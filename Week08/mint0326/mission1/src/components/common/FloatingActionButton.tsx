import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#ff007f] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#ff3399] hover:scale-110 active:scale-95 transition-all z-40 cursor-pointer"
      aria-label="추가"
    >
      <Plus className="w-8 h-8" />
    </button>
  );
};

export default FloatingActionButton;
