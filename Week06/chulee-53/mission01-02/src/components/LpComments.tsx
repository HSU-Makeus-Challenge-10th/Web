import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpComment from "../hooks/queries/useGetInfiniteLpComment";
import CommentsSkeleton from "./CommentsSkeleton";
import { MoreVertical } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../api/auth";

interface Props {
  lpId: number;
}

const LpComments = ({ lpId }: Props) => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data, isFetching, hasNextPage, fetchNextPage } = useGetInfiniteLpComment(lpId, { limit: 10, order });
  const { accessToken } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { ref, inView } = useInView({
      threshold: 0,
  });

  useEffect(() => {
    const fetchUserId = async () => {
      if (accessToken) {
        try {
          const response = await getMyInfo();
          if (response?.data?.id) {
            setCurrentUserId(response.data.id);
          }
        } catch (error) {
          console.error("유저 정보를 불러오는데 실패했습니다.", error);
        }
      }
    };
    fetchUserId();
  }, [accessToken]);

  useEffect(() => {
      if (inView && hasNextPage && !isFetching) {
          fetchNextPage();
      }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="bg-[#242428] rounded-xl p-6 w-full mt-2 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative">
      <div className="flex justify-between items-center mb-6">
        <span className="text-white font-medium">댓글</span>
        <div className="flex">
            <button
                onClick={() => setOrder("asc")}
                className={`border border-gray-500 px-3 py-1.5 text-xs rounded-l transition-colors cursor-pointer ${order === "asc" ? "bg-white text-black" : "bg-transparent text-gray-300 hover:text-white hover:bg-gray-700"}`}
            >
                오래된순
            </button>
            <button
                onClick={() => setOrder("desc")}
                className={`border border-gray-500 border-l-0 px-3 py-1.5 text-xs rounded-r transition-colors cursor-pointer ${order === "desc" ? "bg-white text-black" : "bg-transparent text-gray-300 hover:text-white hover:bg-gray-700"}`}
            >
                최신순
            </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <input 
            type="text" 
            placeholder="댓글을 입력해주세요" 
            className="flex-1 bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
        />
        <button className="bg-gray-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors cursor-pointer font-medium">
            작성
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {data?.pages.map((page) =>
            page.data.data.map((comment) => (
                <div key={comment.id} className="flex gap-3 group relative items-start">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-600 flex items-center justify-center">
                        {comment.author?.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-white">{comment.author?.name?.slice(0, 1) || "U"}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col flex-1">
                        <span className="text-[14px] text-gray-200 font-medium mb-0.5">{comment.author?.name || "알 수 없는 유저"}</span>
                        <p className="text-[14px] text-gray-300 leading-relaxed break-all">
                            {comment.content}
                        </p>
                    </div>

                    {/* More Vertical Icon - Show only if it's the current user's comment */}
                    {currentUserId === comment.author?.id && (
                      <button className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer shrink-0">
                          <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                </div>
            ))
        )}
        
        {isFetching && (
            <div className="flex flex-col mt-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <CommentsSkeleton key={index} />
                ))}
            </div>
        )}
        
        <div ref={ref} className="h-1 w-full" />
      </div>
    </div>
  );
};

export default LpComments;
