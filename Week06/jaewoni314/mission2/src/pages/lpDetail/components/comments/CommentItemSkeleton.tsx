import Skeleton from '../../../../components/skeleton/Skeleton';

const CommentItemSkeleton = () => {
  return (
    <div className="flex gap-3 py-[2vh] border-b border-gray-700">
      <Skeleton className="w-10 h-10 min-w-10 min-h-10 rounded-full flex-shrink-0" />

      {/* 텍스트 영역 */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default CommentItemSkeleton;