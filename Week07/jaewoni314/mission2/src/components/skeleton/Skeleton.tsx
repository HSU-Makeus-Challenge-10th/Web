import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={cn('animate-pulse bg-gray-700 rounded', className)} />;
};

export default Skeleton;
