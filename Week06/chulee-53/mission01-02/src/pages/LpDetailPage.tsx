import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Pencil, Trash2, Heart } from "lucide-react";
import type { Tag } from "../types/lp";

const LpDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetLpDetail(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Loading...
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Error loading LP details.
      </div>
    );
  }

  const lp = response.data;

  const createdDate = new Date(lp.createdAt);
  const timeDiff = new Date().getTime() - createdDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const timeStr = daysDiff > 0 ? `${daysDiff}일 전` : "오늘";
  

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col min-h-[calc(100vh-80px)] text-white font-sans">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#82D8A6] overflow-hidden flex items-center justify-center">
            {/* Checker pattern placeholder */}
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIiAvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIiAvPgo8L3N2Zz4=')] opacity-30 bg-repeat bg-center"></div>
          </div>
          <span className="font-medium text-[15px]">오타니안</span>
        </div>
        <span className="text-gray-300 text-[13px]">{timeStr}</span>
      </div>

      {/* Title & Actions */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-wide">
          {lp.title}
        </h1>
        <div className="flex gap-4 text-gray-400">
          <button className="hover:text-white transition-colors cursor-pointer">
            <Pencil className="w-5 h-5" />
          </button>
          <button className="hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Vinyl Record */}
      <div className="bg-[#242428] rounded-xl p-8 mb-10 flex justify-center items-center shadow-[0_8px_30px_rgb(0,0,0,0.4)] w-full max-w-[500px] mx-auto aspect-square">
        <div
          className="relative w-full h-full max-w-[400px] max-h-[400px] rounded-full overflow-hidden animate-[spin_10s_linear_infinite]"
          style={{
            boxShadow:
              "0 0 20px rgba(0,0,0,0.9) inset, 0 0 15px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover opacity-90"
          />
          {/* Record center hole */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-[#f4f4f5] rounded-full shadow-inner"></div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-100 leading-relaxed mb-10 text-center md:text-left px-2 text-[15px]">
        {lp.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-12">
        {lp.tags?.length > 0 ? (
          lp.tags.map((tag: Tag) => (
            <span
              key={tag.id}
              className="bg-[#36363E] text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide"
            >
              # {tag.name}
            </span>
          ))
        ) : (
          <span className="bg-[#36363E] text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
            # 태그 없음
          </span>
        )}
      </div>

      {/* Likes */}
      <div className="flex justify-center items-center gap-2 pb-10">
        <button className="text-[#FF5983] hover:scale-110 transition-transform cursor-pointer">
          <Heart className="w-6 h-6 fill-current" />
        </button>
        <span className="text-white font-medium text-xl ml-1">
          {lp.likes.length}
        </span>
      </div>
    </div>
  );
};

export default LpDetailPage;
