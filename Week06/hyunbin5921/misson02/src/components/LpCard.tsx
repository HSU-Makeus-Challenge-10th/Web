import { Link } from "react-router-dom";

type LpCardProps = {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string | Date;
  likesCount: number;
};

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

export default function LpCard({ id, title, thumbnail, createdAt, likesCount }: LpCardProps) {
  return (
    <Link to={`/lp/${id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end 
                        bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-3">
            <div className="text-sm font-medium line-clamp-1">{title}</div>
            <div className="mt-0.5 text-xs text-neutral-300 flex items-center gap-3">
              <span>{fmt(createdAt)}</span>
              <span className="inline-flex items-center gap-1">
                ❤️ {likesCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
