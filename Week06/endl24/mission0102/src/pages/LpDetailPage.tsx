import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import { getLpDetail } from "../apis/lp";
import { axiosInstance } from "../apis/axios";
import { CommentSkeleton } from "../components/CommentSkeleton";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

interface CommentType {
  id: number;
  authorName: string;
  content: string;
}

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { accessToken, isLoading } = useAuth();
  const isLoggedIn = !!accessToken; 
  
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { ref, inView } = useInView();
  const isAlerted = useRef(false);
  
  const {
    data: lpResponse,
    isPending: isLpPending,
    isError: isLpError,
  } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(Number(lpid)),
    enabled: isLoggedIn && !!lpid,
  });

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isCommentsPending,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpid, order],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
        params: { page: pageParam, limit: 10, order },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.meta) return undefined;
      return lastPage.data.meta.hasNextPage ? lastPage.data.meta.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isLoggedIn && !!lpid,
  });

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isAlerted.current) {
      isAlerted.current = true;
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [isLoggedIn, isLoading, navigate, location.pathname]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading || !isLoggedIn) return null;

  if (isLpPending) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  
  if (isLpError || !lpResponse) return <div className="text-center py-20 text-red-500 font-bold">데이터를 불러오지 못했습니다.</div>;

  const lp = lpResponse.data;
  const formattedDate = new Date(lp.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-gray-800 font-medium cursor-pointer">
        ← 목록으로 돌아가기
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {lp.authorName?.[0] || "작"}
            </div>
            <span className="font-semibold text-gray-800">{lp.authorName || "작성자"}</span>
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">{lp.title}</h1>
        <div className="w-full max-w-xl mx-auto mb-10 overflow-hidden rounded-2xl shadow-md border border-gray-50">
          <img src={lp.thumbnail} alt={lp.title} className="w-full h-auto object-cover" />
        </div>
        <div className="text-gray-700 mb-10 whitespace-pre-wrap leading-relaxed px-4 text-center">{lp.content}</div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">댓글</h3>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={() => setOrder(PAGINATION_ORDER.asc)} className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${order === PAGINATION_ORDER.asc ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>오래된순</button>
            <button onClick={() => setOrder(PAGINATION_ORDER.desc)} className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${order === PAGINATION_ORDER.desc ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>최신순</button>
          </div>
        </div>

        <div className="flex flex-col">
          {isCommentsPending && <CommentSkeleton count={3} />}
          {commentsData?.pages.map((page, i) => (
            <div key={i}>
              {page.data.data.map((comment: CommentType) => (
                <div key={comment.id} className="flex gap-4 py-5 border-b border-gray-100 last:border-0 group">
                  <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0 flex items-center justify-center text-gray-400 font-bold">{comment.authorName?.[0] || "U"}</div>
                  <div className="flex-1">
                    <span className="font-bold text-sm text-gray-900">{comment.authorName}</span>
                    <p className="text-gray-700 mt-1 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && <CommentSkeleton count={2} />}
          <div ref={ref} className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;