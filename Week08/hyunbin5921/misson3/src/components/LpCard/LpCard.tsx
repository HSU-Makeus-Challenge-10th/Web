import { Link} from "react-router-dom";
import type { Lp } from "../../types/lp.ts";

interface LpCardProps {
  lp: Lp;
}

export const LpCard = ({ lp }: LpCardProps) => {
  const createdDate = new Date(lp.createdAt);

  return (
    <Link
      to={`/lps/${lp.id}`}
      className="group block relative aspect-square overflow-hidden rounded-md bg-black"
    >
      {/* 이미지 + 확대 효과 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* 하단 오버레이 (메타 정보) */}
      <div
        className={`
          absolute inset-x-2 bottom-2
          rounded-md bg-black/85 text-white text-xs
          px-3 py-2
          opacity-0 translate-y-2
          transition-all duration-200
          group-hover:opacity-100 group-hover:translate-y-0
        `}
      >
        <div className="font-semibold text-[11px] line-clamp-2">
          {lp.title}
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-gray-300">
          <span>
            {createdDate.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </span>

          <div className="flex items-center gap-1">
            <span>❤</span>
            <span>{}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};