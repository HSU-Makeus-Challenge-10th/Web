const LpCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-gray-800 animate-pulse">
    <div className="w-full aspect-square bg-gray-700" />
  </div>
);

const LpListSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <LpCardSkeleton key={i} />
    ))}
  </div>
);

export default LpListSkeleton;
