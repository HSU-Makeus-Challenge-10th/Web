import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLpsSearch } from '../api/client'
import { useDebounce } from '../hooks/useDebounce'
import type { SortOrder } from '../types/lp'

const RECENT_KEY = 'lp_recent_searches'

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[] }
  catch { return [] }
}

function saveRecent(q: string) {
  const list = [q, ...getRecent().filter((r) => r !== q)].slice(0, 10)
  localStorage.setItem(RECENT_KEY, JSON.stringify(list))
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY)
}

interface Props {
  onClose: () => void
}

export default function SearchModal({ onClose }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('desc')
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecent)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 500)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['search', debouncedQuery, sort] as const,
    queryFn: ({ pageParam, signal, queryKey }) => {
      const [, search, order] = queryKey
      return fetchLpsSearch(search, order, pageParam as number, signal)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })

  const lps = data?.pages.flatMap((p) => p.data) ?? []

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const el = bottomRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage() },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSearch = (q: string) => {
    setQuery(q)
  }

  const handleRecentClick = (q: string) => {
    setQuery(q)
    saveRecent(q)
    setRecentSearches(getRecent())
    inputRef.current?.focus()
  }

  const handleClearRecent = () => {
    clearRecent()
    setRecentSearches([])
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm">
      {/* 검색 입력 영역 */}
      <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-400">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 bg-transparent text-base text-white placeholder-gray-500 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-500 hover:text-white"
            aria-label="검색어 지우기"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <div className="flex overflow-hidden rounded border border-gray-600 text-xs font-medium">
          <button
            onClick={() => setSort('asc')}
            className={`px-3 py-1 transition-colors ${sort === 'asc' ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:bg-gray-800'}`}
          >
            오래된순
          </button>
          <button
            onClick={() => setSort('desc')}
            className={`border-l border-gray-600 px-3 py-1 transition-colors ${sort === 'desc' ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:bg-gray-800'}`}
          >
            최신순
          </button>
        </div>
        <button
          onClick={onClose}
          className="ml-1 text-gray-400 hover:text-white"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 검색어 없을 때: 최근 검색어 */}
        {!debouncedQuery.trim() && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">최근 검색어</span>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  모두 지우기
                </button>
              )}
            </div>
            {recentSearches.length === 0 ? (
              <p className="text-sm text-gray-600">최근 검색어가 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleRecentClick(q)}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:border-gray-500 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 검색 중 로딩 */}
        {debouncedQuery.trim() && isPending && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-sm bg-gray-800" />
            ))}
          </div>
        )}

        {/* 검색 결과 */}
        {debouncedQuery.trim() && !isPending && (
          <>
            {lps.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">
                "{debouncedQuery}" 검색 결과가 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
                {lps.map((lp) => (
                  <div
                    key={lp.id}
                    onClick={() => {
                      if (debouncedQuery.trim()) {
                        saveRecent(debouncedQuery.trim())
                        setRecentSearches(getRecent())
                      }
                      navigate(`/lps/${lp.id}`)
                      onClose()
                    }}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm bg-gray-900"
                  >
                    {lp.thumbnail ? (
                      <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800 text-4xl">🎵</div>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/0 p-3 opacity-0 transition-all duration-200 group-hover:bg-black/60 group-hover:opacity-100">
                      <p className="truncate text-sm font-semibold text-white">{lp.title}</p>
                      <span className="mt-1 text-xs text-gray-300">♥ {lp.likes.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 무한 스크롤 트리거 */}
            <div ref={bottomRef} className="h-8 w-full" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-pink-500" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
