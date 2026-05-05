import { useLayoutEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchLp, apiClient } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from '../components/LoginModal'

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
        <article className="flex w-full max-w-[920px] flex-col rounded-xl bg-[#292c34] px-6 py-8 text-white shadow-2xl sm:px-16 lg:px-28">
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
      </div>
    </>
  )
}
