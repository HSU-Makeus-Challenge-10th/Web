import Skeleton from '../../../../components/skeleton/Skeleton';

const CommentItemSkeleton = () => {
  return (
    <div className="flex gap-[1.5vw] py-[2vh] border-b border-gray-700">
      <Skeleton className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full" />
      <div className="flex-1 space-y-[1vh]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-[1.5vh] w-[8vw]" />
          <Skeleton className="h-[1.2vh] w-[5vw]" />
        </div>
        <Skeleton className="h-[1.5vh] w-full" />
        <Skeleton className="h-[1.5vh] w-3/4" />
      </div>
    </div>
  );
};

export default CommentItemSkeleton;
