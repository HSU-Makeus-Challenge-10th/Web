import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLpComment, fetchLp, fetchLpComments, getApiErrorMessage, apiClient } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from '../components/LoginModal'
import type { SortOrder } from '../types/lp'

function SkeletonDetail() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] justify-center px-4 py-8">
      <div className="w-full max-w-[760px] animate-pulse rounded-xl bg-[#292c34] p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-700" />
            <div className="h-5 w-24 rounded bg-gray-700" />
          </div>
          <div className="h-4 w-14 rounded bg-gray-700" />
        </div>
        <div className="mb-10 h-7 w-44 rounded bg-gray-700" />
        <div className="mx-auto mb-8 aspect-square w-full max-w-[420px] rounded bg-gray-800" />
        <div className="mx-auto space-y-2">
          <div className="h-4 w-full rounded bg-gray-700" />
          <div className="h-4 w-4/5 rounded bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

function CommentSkeletonItem() {
  return (
    <div className="flex animate-pulse gap-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-slate-500" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-slate-500" />
        <div className="h-4 w-full rounded bg-slate-500" />
      </div>
    </div>
  )
}

function CommentSkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeletonItem key={index} />
      ))}
    </div>
  )
}

function CommentSection({
  lpId,
  authStatus,
  onRequireLogin,
}: {
  lpId: number
  authStatus: 'loading' | 'authenticated' | 'unauthenticated'
  onRequireLogin: () => void
}) {
  const [order, setOrder] = useState<SortOrder>('desc')
  const [content, setContent] = useState('')
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const {
    data,
    isPending,
    isFetchingNextPage,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam, signal }) => fetchLpComments(lpId, order, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !Number.isNaN(lpId),
  })

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, { rootMargin: '200px' })

    observer.observe(target)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const comments = data?.pages.flatMap((page) => page.data) ?? []

  const createCommentMutation = useMutation({
    mutationFn: (newContent: string) => createLpComment(lpId, newContent),
    onSuccess: async () => {
      setContent('')
      await queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] })
    },
    onError: (error: unknown) => {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { status?: number } }).response?.status === 'number'
      ) {
        const status = (error as { response: { status: number } }).response.status
        if (status === 401) return  // client.ts 인터셉터가 전역 처리
        if (status === 403) {
          onRequireLogin()
          return
        }
      }

      alert(`댓글 작성에 실패했습니다.\n${getApiErrorMessage(error)}`)
    },
  })

  const handleSubmit = async () => {
    const trimmedContent = content.trim()
    if (!trimmedContent) return
    if (authStatus === 'loading') return
    if (authStatus === 'unauthenticated') {
      onRequireLogin()
      return
    }

    createCommentMutation.mutate(trimmedContent)
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-[920px] rounded-xl bg-[#292c34] px-6 py-6 text-white shadow-2xl sm:px-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">댓글</h2>
        <div className="inline-flex overflow-hidden rounded border border-gray-500 bg-black text-sm font-medium">
          <button
            onClick={() => setOrder('asc')}
            className={`px-4 py-1.5 transition-colors ${
              order === 'asc' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder('desc')}
            className={`border-l border-gray-500 px-4 py-1.5 transition-colors ${
              order === 'desc' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        <input
          value={content}
          disabled={createCommentMutation.isPending}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSubmit()
          }}
          placeholder="댓글을 입력해주세요"
          className="min-w-0 flex-1 rounded border border-gray-600 bg-[#2f333b] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:border-pink-500"
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || createCommentMutation.isPending}
          className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        >
          {createCommentMutation.isPending ? '작성 중' : '작성'}
        </button>
      </div>

      {isPending && <CommentSkeletonList />}

      {isError && comments.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-10 text-sm text-gray-300">
          <p>댓글을 불러오지 못했습니다.</p>
          <p className="max-w-full break-words rounded bg-black/30 px-3 py-2 text-xs text-red-300">
            {getApiErrorMessage(error)}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-400"
          >
            재시도
          </button>
        </div>
      )}

      {!isPending && comments.length > 0 && (
        <div className="space-y-5">
          {comments.map((comment) => (
            <article key={comment.id} className="flex gap-3">
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink-500 text-xs font-bold">
                  {comment.author.name.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-gray-100">{comment.author.name}</p>
                  <button className="shrink-0 rounded px-2 text-lg leading-none text-gray-300 hover:bg-white/10" aria-label="댓글 메뉴">
                    ⋮
                  </button>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-200">{comment.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isPending && !isError && comments.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">아직 댓글이 없습니다.</p>
      )}

      {!isPending && !isError && <div ref={loadMoreRef} className="h-8" />}

      {isFetchingNextPage && (
        <div className="mt-5">
          <CommentSkeletonList count={4} />
        </div>
      )}

      {isError && comments.length > 0 && (
        <div className="mt-5 flex flex-col items-center gap-3 text-sm text-gray-300">
          <p>추가 댓글을 불러오지 못했습니다.</p>
          <p className="max-w-full break-words rounded bg-black/30 px-3 py-2 text-xs text-red-300">
            {getApiErrorMessage(error)}
          </p>
          <button
            onClick={() => fetchNextPage()}
            className="rounded bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-400"
          >
            다시 불러오기
          </button>
        </div>
      )}
    </section>
  )
}

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>()
  const navigate = useNavigate()
  const { status } = useAuth()
  const [showModal, setShowModal] = useState(status === 'unauthenticated')

  const id = Number(lpid)

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      document.getElementById('main-content')?.scrollTo(0, 0)
    }

    resetScroll()
    requestAnimationFrame(resetScroll)
    const timer = window.setTimeout(resetScroll, 0)
    const lateTimer = window.setTimeout(resetScroll, 100)

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(lateTimer)
    }
  }, [lpid])

  const { data: lp, isPending, isError, refetch } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: ({ signal }) => fetchLp(id, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !Number.isNaN(id),
  })

  const handleLike = async () => {
    if (status === 'unauthenticated') { setShowModal(true); return }
    try {
      await apiClient.post(`/lps/${id}/likes`)
      refetch()
    } catch { /* 이미 좋아요 상태면 무시 */ }
  }

  const handleEdit = () => {
    if (status === 'unauthenticated') { setShowModal(true); return }
    navigate(`/lps/${id}/edit`)
  }

  const handleDelete = async () => {
    if (status === 'unauthenticated') { setShowModal(true); return }
    if (!confirm('정말 삭제하시겠어요?')) return
    try {
      await apiClient.delete(`/lps/${id}`)
      navigate('/', { replace: true })
    } catch { alert('삭제에 실패했습니다.') }
  }

  if (isPending) return <SkeletonDetail />

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-400">데이터를 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-400"
        >
          재시도
        </button>
      </div>
    )
  }

  const date = new Date(lp.createdAt)
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  const timeLabel =
    diff < 1 ? '방금 전' :
    diff < 60 ? `${diff}분 전` :
    diff < 1440 ? `${Math.floor(diff / 60)}시간 전` :
    `${Math.floor(diff / 1440)}일 전`
  const tags = lp.tags ?? []
  const likes = lp.likes ?? []

  return (
    <>
      {showModal && <LoginModal onClose={() => { setShowModal(false); navigate(-1) }} />}

      <div className="flex min-h-[calc(100vh-3rem)] justify-center px-4 pb-8 pt-8 sm:px-6 lg:pt-8">
        <div className="w-full">
        <article className="mx-auto flex w-full max-w-[920px] flex-col rounded-xl bg-[#292c34] px-6 py-8 text-white shadow-2xl sm:px-16 lg:px-28">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {lp.author.avatar ? (
                <img
                  src={lp.author.avatar}
                  alt={lp.author.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-500">
                  {lp.author.name.slice(0, 1)}
                </div>
              )}
              <span className="truncate text-base font-bold sm:text-lg">{lp.author.name}</span>
            </div>
            <span className="shrink-0 pt-1 text-sm text-gray-300">{timeLabel}</span>
          </div>

          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <h1 className="min-w-0 flex-1 break-words text-2xl font-semibold leading-tight text-white">{lp.title}</h1>
            <div className="flex shrink-0 items-center gap-3 pr-2 text-gray-200">
              <button
                onClick={handleEdit}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                aria-label="수정"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                aria-label="삭제"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mx-auto mb-8 aspect-square w-full max-w-[470px] overflow-hidden rounded bg-[#2d3038] p-5 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-gray-900">
              {lp.thumbnail ? (
                <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-800 text-6xl">♪</div>
              )}
              <div className="absolute left-1/2 top-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-300 bg-gray-100" />
            </div>
          </div>

          <p className="mx-auto mb-8 w-full max-w-[620px] whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-100">
            {lp.content}
          </p>

          {tags.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-gray-100">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleLike}
            className="mx-auto mt-auto flex items-center gap-2 text-2xl font-semibold text-white"
            aria-label="좋아요"
          >
            <span className="text-4xl leading-none text-pink-400">♥</span>
            <span>{likes.length}</span>
          </button>
        </article>
        <CommentSection
          lpId={id}
          authStatus={status}
          onRequireLogin={() => setShowModal(true)}
        />
        </div>
      </div>
    </>
  )
}
