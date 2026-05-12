import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { Pencil, Trash2, Heart } from "lucide-react";
import type { Tag, Likes } from "../types/lp";
import LpComments from "../components/LpComments";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useDeleteLp from "../hooks/mutations/useDeleteLp";

const LpDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: me } = useGetMyInfo();

  const lpId = Number(id);
  const { data: response, isLoading, isError } = useGetLpDetail(lpId);

  const likeMutation = usePostLike();
  const unlikeMutation = useDeleteLike();
  const deleteLpMutation = useDeleteLp();

  if (!id || isNaN(lpId)) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Invalid LP ID.
      </div>
    );
  }

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


  const isLiked = lp.likes?.map((like: Likes) => like.userId).includes(me?.data?.id as number) || false;

  const handleToggleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate(lpId);
    } else {
      likeMutation.mutate(lpId);
    }
  };

  const handleDeleteLp = () => {
    if (window.confirm("정말 이 LP를 삭제하시겠습니까?")) {
      deleteLpMutation.mutate(lpId, {
        onSuccess: () => {
          navigate("/");
        }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col min-h-[calc(100vh-80px)] text-white font-sans">
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <img src={lp.author.avatar} alt={lp.author.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-medium text-[15px]">{lp.author.name}</span>
        </div>
        <span className="text-gray-300 text-[13px]">{timeStr}</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-wide">
          {lp.title}
        </h1>
        {me?.data?.id === lp.authorId && (
          <div className="flex gap-4 text-gray-400">
            <button className="hover:text-white transition-colors cursor-pointer">
              <Pencil className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDeleteLp}
              disabled={deleteLpMutation.isPending}
              className="hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

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
      <p className="text-gray-100 leading-relaxed mb-10 text-center md:text-left px-2 text-[15px]">
        {lp.content}
      </p>

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

      <div className="flex justify-center items-center gap-2 pb-6">
        <button onClick={handleToggleLike} className="text-[#FF5983] hover:scale-110 transition-transform cursor-pointer">
          <Heart color={isLiked ? "red" : "white"} fill={isLiked ? "red" : "transparent"} className="w-6 h-6" />
        </button>
        <span className="text-white font-medium text-xl ml-1">
          {lp.likes?.length || 0}
        </span>
      </div>

      {/* Comments Section */}
      <LpComments lpId={Number(id)} />
    </div>
  );
};

export default LpDetailPage;
