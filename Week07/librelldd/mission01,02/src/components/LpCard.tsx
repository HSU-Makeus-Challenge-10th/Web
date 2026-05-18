import { Link } from "react-router-dom";
import { Heart, Calendar } from "lucide-react";
import type { ResponseLpListDto } from "../types/lp";

interface LpCardProps {
  lp: ResponseLpListDto["data"]["data"][number];
}

const LpCard = ({ lp }: LpCardProps) => {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={lp.thumbnail || "https://via.placeholder.com/400?text=No+Image"}
          alt={lp.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-medium px-4 py-2 border border-white rounded-full backdrop-blur-sm">
            상세 보기
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-purple-500 transition-colors">
          {lp.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
          {lp.content}
        </p>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(lp.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center text-xs font-medium text-pink-500">
            <Heart className="w-3 h-3 mr-1 fill-pink-500" />
            {lp.likes?.length || 0}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LpCard;
