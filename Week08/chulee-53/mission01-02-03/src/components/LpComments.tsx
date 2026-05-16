import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpComment from "../hooks/queries/useGetInfiniteLpComment";
import usePostComment from "../hooks/mutations/usePostComment";
import usePatchComment from "../hooks/mutations/usePatchComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import CommentsSkeleton from "./CommentsSkeleton";
import { MoreVertical } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../api/auth";
import defaultAvatar from "../images/defaultavatar.png";

interface Props {
  lpId: number;
}

const LpComments = ({ lpId }: Props) => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data, isFetching, hasNextPage, fetchNextPage } = useGetInfiniteLpComment(lpId, { limit: 10, order });
  const { accessToken } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const postCommentMutation = usePostComment();
  const patchCommentMutation = usePatchComment();
  const deleteCommentMutation = useDeleteComment();

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

  const handlePostComment = () => {
    if (!newCommentContent.trim()) return;
    postCommentMutation.mutate(
      { lpId, content: newCommentContent },
      {
        onSuccess: () => {
          setNewCommentContent("");
        },
      }
    );
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setActiveMenuCommentId(null);
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editingContent.trim()) return;
    patchCommentMutation.mutate(
      { lpId, commentId, content: editingContent },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingContent("");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate({ lpId, commentId });
    }
    setActiveMenuCommentId(null);
  };

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
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePostComment();
            }}
            className="flex-1 bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
        />
        <button 
            onClick={handlePostComment}
            disabled={postCommentMutation.isPending}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors cursor-pointer font-medium disabled:opacity-50"
        >
            {postCommentMutation.isPending ? "작성중..." : "작성"}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {data?.pages.map((page) =>
            page.data.data.map((comment) => (
                <div key={comment.id} className="flex gap-3 group relative items-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-600 flex items-center justify-center">
                        <img 
                            src={comment.author?.avatar || defaultAvatar} 
                            alt={comment.author?.name || "User"} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                        />
                    </div>
                    
                    <div className="flex flex-col flex-1 relative">
                        <span className="text-[14px] text-gray-200 font-medium mb-0.5">{comment.author?.name || "알 수 없는 유저"}</span>
                        
                        {editingCommentId === comment.id ? (
                          <div className="flex flex-col gap-2 mt-1">
                            <input 
                                type="text"
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="bg-transparent border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-gray-400"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleSaveEdit(comment.id)} 
                                    disabled={patchCommentMutation.isPending}
                                    className="text-xs bg-[#FF1E90] text-white px-3 py-1 rounded hover:bg-pink-600 cursor-pointer disabled:opacity-50"
                                >
                                    저장
                                </button>
                                <button 
                                    onClick={() => setEditingCommentId(null)} 
                                    className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500 cursor-pointer"
                                >
                                    취소
                                </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[14px] text-gray-300 leading-relaxed break-all">
                              {comment.content}
                          </p>
                        )}
                    </div>

                    {currentUserId === comment.author?.id && (
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id)}
                          className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer shrink-0"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuCommentId === comment.id && (
                          <div className="absolute right-0 top-6 w-24 bg-[#1f1f1f] border border-gray-700 rounded-md shadow-lg overflow-hidden z-10 flex flex-col">
                            <button 
                              onClick={() => handleEditComment(comment.id, comment.content)}
                              className="text-xs text-white text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              수정
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-400 text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
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
