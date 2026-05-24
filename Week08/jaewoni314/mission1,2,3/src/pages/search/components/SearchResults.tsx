import type { InfiniteData } from '@tanstack/react-query';
import type { Lp, LpPaginationData } from '../../../types/lp';
import LpCard from '../../home/components/LpCard';
import LpCardSkeleton from '../../home/components/LpCardSkeleton';

interface SearchResultsProps {
  data: InfiniteData<LpPaginationData> | undefined;
  isFetchingNextPage: boolean | undefined;
  showSkeleton: boolean;
  observerRef: (node?: Element | null) => void;
}

const SearchResults = ({
  data,
  isFetchingNextPage,
  showSkeleton,
  observerRef,
}: SearchResultsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {showSkeleton
          ? Array.from({ length: 20 }).map((_, index) => (
              <LpCardSkeleton key={index} />
            ))
          : data?.pages.map((page) =>
              page?.data.map((lp: Lp) => (
                <LpCard key={`${page?.nextCursor}-${lp.id}`} lp={lp} />
              ))
            )}
      </div>
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchResults;
