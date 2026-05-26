import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLps } from '../api/client'
import SearchModal from '../components/SearchModal'
import { useThrottle } from '../hooks/useThrottle'
import type { SortOrder } from '../types/lp'

// ── 스켈레톤 카드 ──────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="aspect-square animate-pulse rounded-sm bg-gray-800">
      <div className="h-full w-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800" />
    </div>
  )
}

function LpListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

// ── LP 카드 ────────────────────────────────────────────────

function LpCard({ id, title, thumbnail, createdAt, likes }: {
  id: number; title: string; thumbnail: string | null
  createdAt: string; likes: { id: number }[]
}) {
  const navigate = useNavigate()
  const date = new Date(createdAt)
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  const timeLabel =
    diff < 1 ? '방금 전' :
    diff < 60 ? `${diff}분 전` :
    diff < 1440 ? `${Math.floor(diff / 60)}시간 전` :
    `${Math.floor(diff / 1440)}일 전`

  return (
    <div
      onClick={() => navigate(`/lps/${id}`)}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm bg-gray-900"
    >
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-800 text-4xl">🎵</div>
      )}
      {/* 호버 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-end bg-black/0 p-3 opacity-0 transition-all duration-200 group-hover:bg-black/60 group-hover:opacity-100">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-300">
          <span>{timeLabel}</span>
          <span>♥ {likes.length}</span>
        </div>
      </div>
    </div>
  )
}

// ── 메인 페이지 ────────────────────────────────────────────

export default function LpListPage() {
  const [sort, setSort] = useState<SortOrder>('desc')
  const [showSearch, setShowSearch] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ signal, pageParam }) => fetchLps(sort, pageParam as number, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const lps = data?.pages.flatMap((p) => p.data) ?? []

  const throttledFetchNextPage = useThrottle(fetchNextPage, 1000)

  useEffect(() => {
    const el = bottomRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          throttledFetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, throttledFetchNextPage])

  return (
    <>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      <div className="mx-auto w-full max-w-[980px] px-4 pb-8 pt-6">
        {/* 검색 + 정렬 버튼 */}
        <div className="sticky top-12 z-20 mb-4 flex items-center justify-between bg-black/95 py-2">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-black px-3 py-1.5 text-sm text-gray-400 hover:border-gray-500 hover:text-white"
            aria-label="검색"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            검색
          </button>

          <div className="flex items-center gap-2">
            {isFetching && !isPending && !isFetchingNextPage && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-pink-500" />
            )}
            <div className="inline-flex overflow-hidden rounded border border-gray-500 bg-black text-sm font-medium shadow-lg">
              <button
                onClick={() => setSort('asc')}
                className={`px-4 py-1.5 transition-colors ${
                  sort === 'asc' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                오래된순
              </button>
              <button
                onClick={() => setSort('desc')}
                className={`border-l border-gray-500 px-4 py-1.5 transition-colors ${
                  sort === 'desc' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                최신순
              </button>
            </div>
          </div>
        </div>

        {/* 로딩 */}
        {isPending && <LpListSkeleton />}

        {/* 에러 */}
        {isError && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-gray-400">데이터를 불러오지 못했습니다.</p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-400"
            >
              재시도
            </button>
          </div>
        )}

        {/* LP 그리드 */}
        {!isPending && !isError && lps.length > 0 && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {lps.map((lp) => (
              <LpCard key={lp.id} {...lp} />
            ))}
          </div>
        )}

        {!isPending && !isError && lps.length === 0 && (
          <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-gray-800 text-sm text-gray-400">
            LP가 없습니다.
          </div>
        )}

        {/* 스크롤 테스트용 콘텐츠 */}
        <div className="mt-8 space-y-4 text-gray-600 text-sm">
          <p>스크롤 테스트용 텍스트입니다.</p>
          {Array.from({ length: 30 }).map((_, i) => (
            <p key={i}>Lorem ipsum dolor sit amet... (줄 {i + 1})</p>
          ))}
        </div>

        {/* 무한 스크롤 트리거 */}
        <div ref={bottomRef} className="h-8 w-full" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-pink-500" />
          </div>
        )}
      </div>
    </>
  )
}
