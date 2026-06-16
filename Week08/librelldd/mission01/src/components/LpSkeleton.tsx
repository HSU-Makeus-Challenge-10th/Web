const LpSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const LpListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <LpSkeleton key={i} />
      ))}
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  );
};

export const CommentListSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
};

export default LpSkeleton;
