// /src/components/CommentSkeleton.tsx

import React from "react";

interface CommentSkeletonProps {
  count?: number; // count를 Optional로 변경하여 Prop 오류 해결
}

const CommentSkeleton: React.FC<CommentSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex space-x-3 py-3 animate-pulse border-b border-gray-100 dark:border-gray-700"
        >
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />

          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default CommentSkeleton;
