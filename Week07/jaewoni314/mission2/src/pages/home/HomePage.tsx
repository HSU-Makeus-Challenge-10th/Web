import { useState, useEffect } from 'react';
import { useLps } from '../../hooks/lp/useLps';
import type { GetLpsParams, Lp } from '../../types/lp';
import Error from '../../components/error/Error';
import { useInView } from 'react-intersection-observer';
import LpCard from './components/LpCard';
import LpCardSkeleton from './components/LpCardSkeleton';
import OrderSelector from '../../components/orderSelector/OrderSelector';

const HomePage = () => {
  const [order, setOrder] = useState<GetLpsParams['order']>('desc');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useLps({ order, limit: 10 });

  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isError) return <Error message={error.message} />;

  const hasData =
    data?.pages && data.pages.length > 0 && data.pages[0]?.data && data.pages[0].data.length > 0;
  const showSkeleton = isLoading || !hasData;

  return (
    <div className="p-4">
      <OrderSelector order={order} onOrderChange={setOrder} />
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
      {/* 무한스크롤 감지 및 로딩 스켈레톤 표시 */}
      <div ref={ref} className="h-10" />
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
