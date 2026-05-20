import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLpList } from '../hooks/useLpList';
import { createLp } from '../apis/lp';
import { useAuth } from '../context/AuthContext';
import LpFormModal from '../components/lp/LpFormModal';
import HomeContent from '../components/lp/HomeContent';
import type { SortOrder } from '../types/common';
import { useDebounce } from '../hooks/useDebounce';

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

  // 무한 스크롤 트리거: 하단 sentinel 요소를 IntersectionObserver로 감시
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 바닥 감지 + 다음 페이지 존재 + 현재 추가 로딩 중 아님 => fetchNextPage
        if (entries[0].isIntersecting && isSearchReady && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    // 관찰 해제(cleanup)로 중복 observe 및 메모리 누수 방지
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearchReady]);

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

      <HomeContent
        isSearchReady={isSearchReady}
        isLoading={isLoading}
        isError={isError}
        error={error}
        lps={lps}
        isFetchingNextPage={isFetchingNextPage}
        sentinelRef={sentinelRef}
        onRetry={() => void refetch()}
      />

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
