import Skeleton from '../../../components/skeleton/Skeleton';

const LpCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <Skeleton className="w-full aspect-square" />
    </div>
  );
};

export default LpCardSkeleton;
