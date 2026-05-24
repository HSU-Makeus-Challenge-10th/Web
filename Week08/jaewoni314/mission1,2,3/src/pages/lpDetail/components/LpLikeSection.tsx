import { Heart } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface LpLikeSectionProps {
  likeCount: number;
  isLiked: boolean;
  onLikeToggle: () => void;
}

const LpLikeSection = ({
  likeCount,
  isLiked,
  onLikeToggle,
}: LpLikeSectionProps) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <button
        type="button"
        onClick={onLikeToggle}
        className="text-red-500 hover:text-red-400 transition-colors"
      >
        <Heart
          size={32}
          className={cn(isLiked ? 'fill-current' : 'fill-none')}
        />
      </button>
      <span className="font-bold text-lg md:text-xl">{likeCount}</span>
    </div>
  );
};

export default LpLikeSection;
