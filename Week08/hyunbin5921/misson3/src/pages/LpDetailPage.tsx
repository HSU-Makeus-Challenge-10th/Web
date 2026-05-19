import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";

import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

import { useAuth } from "../context/AuthContext";
import type { ResponseLpDto } from "../types/lp";
import type { RequestLpDto } from "../types/lp";

export const LpDetailPage = () => {
  const { lpid } = useParams();
  const numericId = Number(lpid);

  const { accessToken } = useAuth();

  // 상세 조회: ResponseLpDto = CommonResponse<Lp>
  const {
    data: lpResponse,
    isPending,
    isError,
  } = useGetLpDetail({ lpid: numericId });

  const { data: me } = useGetMyInfo(accessToken);

  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();

  const lpData: ResponseLpDto["data"] | undefined = lpResponse?.data;
  const meData = me?.data;

  const isLiked =
    !!lpData &&
    !!meData &&
    lpData.likes.some((like) => like.userId === meData.id);

  const handleLikeLp = () => {
    if (!numericId) return;
    const body: RequestLpDto = { lpid: numericId };
    likeMutate(body);
  };

  const handleDislikeLp = () => {
    if (!numericId) return;
    const body: RequestLpDto = { lpid: numericId };
    dislikeMutate(body);
  };

  if (isPending) return <div className="mt-20 text-white">Loading..</div>;
  if (isError || !lpData)
    return <div className="mt-20 text-white">Error..</div>;

  const createdAtLabel = new Date(lpData.createdAt).toLocaleDateString(
    "ko-KR",
    { month: "short", day: "numeric" }
  );
  const likeCount = lpData.likes.length;

  return (
    <div className="flex justify-center py-12 text-white">
      <div className="w-full max-w-3xl rounded-2xl bg-[#1f2127] px-10 py-8 shadow-xl">
        {/* 상단 메타 영역 */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-300">
          <div className="font-semibold">LP #{lpData.id}</div>
          <div>{createdAtLabel}</div>
        </div>

        {/* 제목 */}
        <h1 className="mb-8 text-3xl font-bold">{lpData.title}</h1>

        {/* 썸네일 */}
        <div className= "border border-black shadow-full">
          <div className="mb-10 flex justify-center pt-10">
            <div
              className="relative w-[320px] aspect-square flex items-center justify-center 
                  rounded-full overflow-hidden shadow-2xl bg-[#111]"
            >
              {/* LP 이미지 */}
              <img
                src={lpData.thumbnail}
                alt={lpData.title}
                className="absolute inset-0 w-full h-full object-cover rounded-full 
                 scale-110 opacity-95 border-5 border-black shadow-lg"
              />

              {/* LP 가장자리(그루브) 효과 */}
              <div
                className="absolute inset-0 rounded-full 
                    ring-8 ring-black/60 
                    shadow-[0_0_40px_rgba(0,0,0,0.8)]"
              />

              {/* LP 중앙 라벨 */}
              <div
                className="absolute w-[80px] h-[80px] rounded-full bg-white/85 
                    flex items-center justify-center text-black 
                    font-bold text-xl uppercase tracking-wide shadow-inner"
              >
                {lpData.title.slice(0, 1)}
              </div>

              {/* LP 구멍 (센터 홀) */}
              <div className="absolute w-[36px] h-[36px] rounded-full bg-[#e9e9e9] shadow-inner" />
            </div>
          </div>
        </div>
        {/* 내용 */}
        <p className="mb-6 text-sm leading-relaxed text-gray-200">
          {lpData.content}
        </p>

        {/* 태그 */}
        {lpData.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {lpData.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={isLiked ? handleDislikeLp : handleLikeLp}
            className="flex items-center gap-2 text-lg"
          >
            <Heart
              size={26}
              color={isLiked ? "red" : "white"}
              fill={isLiked ? "red" : "transparent"}
            />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
