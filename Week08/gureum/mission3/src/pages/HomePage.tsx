import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLpList } from '../hooks/useLpList';
import { createLp } from '../apis/lp';
import { useAuth } from '../context/AuthContext';
import LpCard from '../components/lp/LpCard';
import LpListSkeleton from '../components/lp/LpListSkeleton';
import LpFormModal from '../components/lp/LpFormModal';
import type { SortOrder } from '../types/common';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';

const HomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [sort, setSort] = useState<SortOrder>('desc');
  const [query, setQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const isSearchReady = debouncedQuery.trim().length > 0;
  // useInfiniteQuery 표준 UI 분기: 초기 로딩/에러/성공 + 추가 페이지 로딩
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLpList(sort, debouncedQuery);

  // 모든 페이지의 lp 목록을 하나의 배열로 합침
  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  const throttledFetchNextPage = useThrottle((isIntersecting: boolean) => {
    if (isIntersecting && isSearchReady && hasNextPage && !isFetchingNextPage) {
      console.log('[throttle] 다음 페이지 요청');
      void fetchNextPage();
    }
  }, 1000);

  // 무한 스크롤 트리거: 하단 sentinel 요소를 IntersectionObserver로 감시
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 스크롤 이벤트가 연속으로 발생해도 interval 내 1회만 실행
        throttledFetchNextPage(entries[0].isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    // 관찰 해제(cleanup)로 중복 observe 및 메모리 누수 방지
    return () => observer.disconnect();
  }, [throttledFetchNextPage]);

  const createLpMutation = useMutation({
    mutationFn: createLp,
    onSuccess: async () => {
      setIsCreateModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });

  const handleOpenCreateModal = () => {
    if (!accessToken) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setIsCreateModalOpen(true);
  };

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

      {/* 검색 입력 + debounce */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="LP 제목/내용 검색"
          className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {!isSearchReady && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p>검색어를 입력하면 결과를 불러옵니다.</p>
        </div>
      )}

      {/* [Skeleton UI] 초기 로딩: 첫 진입 시 콘텐츠 자리 점유(레이아웃 점프/깜빡임 완화) */}
      {isSearchReady && isLoading && <LpListSkeleton />}

      {/* 에러 상태 */}
      {isSearchReady && isError && (
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
      {isSearchReady && !isLoading && !isError && (
        lps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>
        )
      )}

      {/* [Skeleton UI] 추가 로딩: 기존 리스트는 유지하고 하단만 Skeleton을 붙여 연속성 유지 */}
      {isSearchReady && isFetchingNextPage && (
        <div className="mt-4">
          <LpListSkeleton />
        </div>
      )}

      {/* 무한 스크롤 sentinel(바닥 감지 기준점) */}
      <div ref={sentinelRef} className="h-4" />

      {/* 우측 하단 플로팅 버튼 (+) */}
      <button
        type="button"
        onClick={handleOpenCreateModal}
        aria-label="LP 만들기"
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white text-3xl rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
      >
        +
      </button>

      <LpFormModal
        isOpen={isCreateModalOpen}
        title="LP 작성"
        submitLabel="Add LP"
        isSubmitting={createLpMutation.isPending}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(values) => createLpMutation.mutate(values)}
      />
    </div>
  );
};

export default HomePage;
