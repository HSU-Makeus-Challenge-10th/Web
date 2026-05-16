const CommentsSkeleton = () => {
    return (
        <div aria-hidden="true" className="flex gap-3 group relative items-start animate-pulse mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-600 shrink-0"></div>
            <div className="flex flex-col flex-1 gap-2">
                <div className="h-4 bg-gray-600 rounded w-24"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
        </div>
    );
};

export default CommentsSkeleton;
