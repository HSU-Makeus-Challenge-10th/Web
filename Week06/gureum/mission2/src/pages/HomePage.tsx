import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLpList } from '../hooks/useLpList';
import LpCard from '../components/lp/LpCard';
import LpListSkeleton from '../components/lp/LpListSkeleton';
import type { SortOrder } from '../types/common';

const HomePage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOrder>('desc');
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLpList(sort);

  // 모든 페이지의 lp 목록을 하나의 배열로 합침
  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  // 무한 스크롤 트리거: 하단 sentinel 요소를 IntersectionObserver로 감시
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="relative min-h-[calc(100vh-65px)] p-6">
      {/* 헤더 + 정렬 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">LP 목록</h2>
        <button
          onClick={() => setSort((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded border border-gray-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {sort === 'desc' ? '최신순' : '오래된순'}
        </button>
      </div>

      {/* 초기 로딩 스켈레톤 (상단에만) */}
      {isLoading && <LpListSkeleton />}

      {/* 에러 상태 */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-400 text-lg">
            {(error as Error)?.message ?? '데이터를 불러오지 못했습니다.'}
          </p>
          <button
            onClick={() => void refetch()}
            className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* LP 그리드 */}
      {!isLoading && !isError && (
        lps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>등록된 LP가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>
        )
      )}

      {/* 추가 로딩 스켈레톤 (하단에만) */}
      {isFetchingNextPage && (
        <div className="mt-4">
          <LpListSkeleton />
        </div>
      )}

      {/* 무한 스크롤 sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* 우측 하단 플로팅 버튼 (+) */}
      <button
        type="button"
        onClick={() => navigate('/lp/create')}
        aria-label="LP 만들기"
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white text-3xl rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
