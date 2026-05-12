const LPCardSkeleton = () => (
  <div className="relative rounded-lg overflow-hidden shadow-lg animate-pulse">
    {/* 1. 이미지 영역 (BG Gray) */}
    <div className="bg-gray-300 h-48 w-full" />

    {/* 2. 타이틀 영역 (어두운 오버레이) */}
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-75">
      {/* 타이틀 텍스트를 모방한 회색 막대 */}
      <div className="bg-gray-400 h-4 w-3/4 rounded-sm" />
    </div>
  </div>
);

export default LPCardSkeleton;
