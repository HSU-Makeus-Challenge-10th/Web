// [Skeleton UI]
// 실제 LP 카드의 크기/배치를 미리 점유해 로딩 중 레이아웃 흔들림을 줄인다.
const LpCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-gray-800 animate-pulse">
    <div className="w-full aspect-square bg-gray-700" />
  </div>
);

// 목록 초기 로딩/추가 로딩에서 재사용하는 그리드 스켈레톤
const LpListSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <LpCardSkeleton key={i} />
    ))}
  </div>
);

export default LpListSkeleton;
