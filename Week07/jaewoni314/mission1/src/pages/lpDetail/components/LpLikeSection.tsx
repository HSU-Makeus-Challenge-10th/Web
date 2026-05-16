import { Heart } from 'lucide-react';

interface LpLikeSectionProps {
  likeCount: number;
  isLiked: boolean;
  onLikeToggle: () => void;
}

const LpLikeSection = ({
  likeCount,
  // isLiked,
  onLikeToggle,
}: LpLikeSectionProps) => {
  return (
    <div className="flex items-center justify-center gap-[0.8vw]">
      <button
        type="button"
        onClick={onLikeToggle}
        className="text-red-500 hover:text-red-400 transition-colors"
      >
        <Heart size={32} fill="none" />
      </button>
      <span className="font-bold text-[1.3vw]">{likeCount}</span>
    </div>
  );
};

export default LpLikeSection;
