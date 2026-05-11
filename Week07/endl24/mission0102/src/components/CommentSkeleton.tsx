interface CommentSkeletonProps {
  count?: number;
}

export const CommentSkeleton = ({ count = 10 }: CommentSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 py-4 animate-pulse border-b border-gray-100 last:border-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
          </div>
        </div>
      ))}
    </>
  );
};