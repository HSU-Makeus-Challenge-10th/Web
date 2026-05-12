import { useNavigate } from 'react-router-dom';
import type { Lp } from '../../types/lp';

interface LpCardProps {
  lp: Lp;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

const getLikeCount = (lp: Lp) => lp._count?.likes ?? lp.likes?.length ?? 0;

/**
 * [카드 인터랙션]
 * - Hover 시 hover:scale-105 로 카드 확대
 * - 썸네일에 group-hover:blur-sm + group-hover:brightness-50 으로 어두운 오버레이 효과
 * - 오버레이 위에 제목 / 업로드일 / 좋아요 수 메타 정보 표시(opacity-0 → opacity-100)
 *
 * [카드 라우팅]
 * - 카드 클릭 시 해당 LP의 id를 경로 파라미터로 /lp/:lpId 로 이동
 */
const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      // 카드 클릭 → /lp/:lpId 상세 페이지로 라우팅
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
    >
      {/* 썸네일 */}
      <img
        src={lp.thumbnail ?? '/placeholder.png'}
        alt={lp.title}
        className="w-full aspect-square object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/111/fff?text=LP'; }}
      />

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-base font-bold text-white text-center mb-2 line-clamp-2">{lp.title}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(lp.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {getLikeCount(lp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
