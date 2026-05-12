// [Skeleton UI]
// 댓글 아바타/작성자/본문 구조를 그대로 모사해 체감 로딩 시간을 줄인다.
const CommentSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-24 h-3 bg-gray-700 rounded" />
          <div className="w-full h-4 bg-gray-700 rounded" />
          <div className="w-3/4 h-4 bg-gray-700 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default CommentSkeleton;
