import type { RefObject } from 'react';
import LpCard from './LpCard';
import LpListSkeleton from './LpListSkeleton';
import type { Lp } from '../../types/lp';

interface HomeContentProps {
  isSearchReady: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  lps: Lp[];
  isFetchingNextPage: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onRetry: () => void;
}

const HomeContent = ({
  isSearchReady,
  isLoading,
  isError,
  error,
  lps,
  isFetchingNextPage,
  sentinelRef,
  onRetry,
}: HomeContentProps) => {
  if (!isSearchReady) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p>검색어를 입력하면 결과를 불러옵니다.</p>
      </div>
    );
  }

  if (isLoading) return <LpListSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-400 text-lg">{(error as Error)?.message ?? '데이터를 불러오지 못했습니다.'}</p>
        <button onClick={onRetry} className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      {lps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {lps.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-4">
          <LpListSkeleton />
        </div>
      )}
      <div ref={sentinelRef} className="h-4" />
    </>
  );
};

export default HomeContent;
