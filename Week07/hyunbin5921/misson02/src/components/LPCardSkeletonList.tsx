import LPCardSkeleton from "./LPCardSkeleton";

interface Props {
  count: number;
}

const LPCardSkeletonList = ({ count }: Props) => {
  return (
    // 실제 LP 목록과 동일한 그리드 구조를 사용해야 레이아웃이 깨지지 않습니다.
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* new Array(count).fill(0) 대신 Array.from 사용 [00:45:19] */}
      {Array.from({ length: count }).map((_, index) => (
        <LPCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LPCardSkeletonList;
