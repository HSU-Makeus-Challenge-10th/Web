import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLps } from '../../hooks/useLps';
import type { GetLpsParams, Lp } from '../../types/lp';
import Error from '../../components/error/Error';
import { useInView } from 'react-intersection-observer';
import LpCard from './components/LpCard';
import LpCardSkeleton from './components/LpCardSkeleton';
import OrderSelector from '../../components/orderSelector/OrderSelector';

const HomePage = () => {
  const [order, setOrder] = useState<GetLpsParams['order']>('desc');
  const queryClient = useQueryClient();

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

  // 정렬 변경 시 기존 캐시 제거 후 첫 페이지부터 다시 로드
  const handleOrderChange = (newOrder: 'asc' | 'desc') => {
    queryClient.removeQueries({ queryKey: ['lps'] });
    setOrder(newOrder);
  };

  if (isError) return <Error message={error.message} />;

  const hasData =
    data?.pages && data.pages.length > 0 && data.pages[0].data.length > 0;
  const showSkeleton = isLoading || !hasData;

  return (
    <div className="p-4">
      <OrderSelector order={order} onOrderChange={handleOrderChange} />

      {/* 초기 로딩 스켈레톤 or 실제 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {showSkeleton
          ? Array.from({ length: 20 }).map((_, index) => (
              <LpCardSkeleton key={index} />
            ))
          : data?.pages.map((page) =>
              page.data.map((lp: Lp) => (
                <LpCard key={`${page.nextCursor}-${lp.id}`} lp={lp} />
              ))
            )}
      </div>

      {/* 무한스크롤 감지 영역 */}
      <div ref={ref} className="h-10" />

      {/* 추가 로딩 스켈레톤 (하단) */}
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