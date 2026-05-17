import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import { CommentSkeleton } from "../components/CommentSkeleton";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";
import { LpCreateModal } from "../components/modal/LpCreateModal";
import { CommentInput } from "../components/CommentInput";
import { CommentItem, type CommentType } from "../components/CommentItem";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { accessToken, isLoading, user } = useAuth();
  const isLoggedIn = !!accessToken;

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { ref, inView } = useInView();
  const isAlerted = useRef(false);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();
  const { mutate: deleteMutate } = useDeleteLp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: lpResponse,
    isPending: isLpPending,
    isError: isLpError,
  } = useGetLpDetail(lpId);

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isCommentsPending,
  } = useGetInfiniteComments(Number(lpId), order, isLoggedIn);

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

  if (isLpPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (isLpError || !lpResponse)
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        데이터를 불러오지 못했습니다.
      </div>
    );

  const lp = lpResponse.data;
  const formattedDate = new Date(lp.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isLiked = lp.likes?.some((like) => like.userId === user?.id);

  const handleLikeLp = () => {
    likeMutate({
      lpId: Number(lpId),
      title: "",
      content: "",
      thumbnail: "",
      tags: [],
      published: false,
    });
  };

  const handleDisLikeLp = () => {
    dislikeMutate({
      lpId: Number(lpId),
      title: "",
      content: "",
      thumbnail: "",
      tags: [],
      published: false,
    });
  };
  const handleDelete = () => {
    if (window.confirm("정말 이 LP를 삭제하시겠습니까?")) {
      deleteMutate(Number(lpId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
      >
        ← 목록으로 돌아가기
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 동그라미 */}
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {lp.author?.name?.[0] || "U"}
            </div>

            {/* 이름과 뱃지를 가로로 배치 */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 text-lg">
                {lp.author?.name || "알 수 없는 사용자"}
              </span>
            </div>
          </div>

          <span className="text-sm text-gray-500 font-medium">
            {formattedDate}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b pb-6 border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 text-left">
            {lp.title}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              삭제
            </button>
          </div>
          <LpCreateModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            isEdit={true}
            lpId={Number(lpId)}
            initialData={{
              title: lp.title,
              content: lp.content,
              thumbnail: lp.thumbnail,
              tags:
                lp.tags?.map((tag: { id: number; name: string }) => tag.name) ||
                [],
            }}
          />
        </div>
        <div className="w-full max-w-xl mx-auto mb-10 overflow-hidden rounded-2xl shadow-md border border-gray-50">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="text-gray-700 mb-8 whitespace-pre-wrap leading-relaxed px-4">
          {lp.content}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 border-t border-gray-100 pt-6 mt-2">
          {lp.tags && lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start sm:justify-start w-full sm:w-auto mb-2 sm:mb-0">
              {lp.tags.map((tag: { id: number; name: string }) => (
                <span
                  key={tag.id}
                  className="px-3 py-1.5 bg-gray-50/80 text-gray-500 rounded-lg text-sm font-medium border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={isLiked ? handleDisLikeLp : handleLikeLp}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              isLiked
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-lg">{lp.likes?.length || 0}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">댓글</h3>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setOrder(PAGINATION_ORDER.asc)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${order === PAGINATION_ORDER.asc ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
            >
              오래된순
            </button>
            <button
              onClick={() => setOrder(PAGINATION_ORDER.desc)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${order === PAGINATION_ORDER.desc ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
            >
              최신순
            </button>
          </div>
        </div>
        {isLoggedIn ? (
          <CommentInput lpId={Number(lpId)} />
        ) : (
          <div className="mb-8 p-4 bg-gray-50 text-center text-gray-500 rounded-xl">
            댓글을 작성하려면 로그인이 필요합니다.
          </div>
        )}
        <div className="flex flex-col">
          {isCommentsPending && <CommentSkeleton count={5} />}
          {commentsData?.pages.map((page, i) => (
            <div key={i}>
              {page.data.data.map((comment: CommentType) => (
                <CommentItem
                  key={comment.id}
                  lpId={Number(lpId)}
                  comment={comment}
                  currentUserId={user?.id}
                  postAuthorId={lp.author.id}
                />
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
