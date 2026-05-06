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
