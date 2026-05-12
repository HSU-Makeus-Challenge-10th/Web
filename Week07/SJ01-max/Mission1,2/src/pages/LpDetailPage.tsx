import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchLp, apiDeleteLp, apiLikeLp, apiUnlikeLp, apiUpdateLp, apiUploadFile } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from '../components/LoginModal'
import CommentSection from '../components/CommentSection'
import type { LpDetail } from '../types/lp'

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
  const { status, user } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(null)

  const id = Number(lpid)

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    resetScroll()
    requestAnimationFrame(() => {
      resetScroll()
      setTimeout(resetScroll, 0)
      setTimeout(resetScroll, 100)
    })
  }, [lpid])

  const { data: lp, isPending, isError, refetch } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: ({ signal }) => fetchLp(id, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !Number.isNaN(id),
    retry: 1,
  })

  const deleteMutation = useMutation({
    mutationFn: () => apiDeleteLp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] })
      navigate('/', { replace: true })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async () => {
      let thumbnail = lp?.thumbnail ?? null
      if (editFile) {
        try { thumbnail = await apiUploadFile(editFile) } catch { /* 유지 */ }
      }
      return apiUpdateLp(id, { title: editTitle.trim() || lp?.title, thumbnail })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] })
      queryClient.invalidateQueries({ queryKey: ['lps'] })
      setIsEditing(false)
      setEditFile(null)
      setEditPreview(null)
    },
  })

  const likeMutation = useMutation({
    mutationFn: (wasLiked: boolean) => wasLiked ? apiUnlikeLp(id) : apiLikeLp(id),
    onMutate: async (wasLiked) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpid] })
      const prev = queryClient.getQueryData<LpDetail>(['lp', lpid])
      queryClient.setQueryData<LpDetail>(['lp', lpid], (old) => {
        if (!old || !user) return old
        return {
          ...old,
          likes: wasLiked
            ? old.likes.filter((l) => l.userId !== user.id)
            : [...old.likes, { id: Date.now(), userId: user.id, lpId: id }],
        }
      })
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(['lp', lpid], context.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] })
    },
  })

  useEffect(() => {
    if (lp?.title) {
      setEditTitle(lp.title)
      window.scrollTo(0, 0)
    }
  }, [lp?.title])

  const requireAuth = (action: () => void) => {
    if (status === 'unauthenticated') { setShowModal(true); return }
    action()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setEditFile(f)
    setEditPreview(URL.createObjectURL(f))
  }

  if (isPending) return <SkeletonDetail />

  if (isError || !lp) {
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

  const diff = Math.floor((Date.now() - new Date(lp.createdAt).getTime()) / 60000)
  const timeLabel =
    diff < 1 ? '방금 전' :
    diff < 60 ? `${diff}분 전` :
    diff < 1440 ? `${Math.floor(diff / 60)}시간 전` :
    `${Math.floor(diff / 1440)}일 전`

  const tags = lp.tags ?? []
  const likes = lp.likes ?? []
  const isAuthor = !!user && user.id === lp.authorId
  const isLiked = !!user && likes.some((l) => l.userId === user.id)
  const currentThumbnail = editPreview ?? lp.thumbnail

  return (
    <>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      <div className="flex min-h-[calc(100vh-3rem)] justify-center px-4 pb-8 pt-8 sm:px-6">
        <article className="flex w-full max-w-[920px] flex-col rounded-xl bg-[#292c34] px-6 py-8 text-white shadow-2xl sm:px-16 lg:px-28">

          {/* 작성자 + 시간 */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {lp.author.avatar ? (
                <img src={lp.author.avatar} alt={lp.author.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-500">
                  {lp.author.name.slice(0, 1)}
                </div>
              )}
              <span className="truncate text-base font-bold sm:text-lg">{lp.author.name}</span>
            </div>
            <span className="shrink-0 text-sm text-gray-300">{timeLabel}</span>
          </div>

          {/* 제목 영역 */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
            {isAuthor && isEditing ? (
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateMutation.mutate()}
                  className="min-w-0 flex-1 rounded-lg border border-gray-600 bg-[#1e1e2e] px-4 py-2 text-xl font-semibold text-white outline-none focus:border-pink-500"
                  autoFocus
                />
                {/* 저장 */}
                <button
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-300 hover:bg-white/10 disabled:opacity-50"
                  title="저장"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                {/* 취소 */}
                <button
                  onClick={() => { setIsEditing(false); setEditTitle(lp.title); setEditPreview(null); setEditFile(null) }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-white/10"
                  title="취소"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <h1 className="min-w-0 flex-1 break-words text-2xl font-semibold leading-tight text-white">{lp.title}</h1>
            )}

            {isAuthor && (
              <div className="flex shrink-0 items-center gap-2 pt-1 text-gray-300">
                {/* 수정 */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                  title="수정"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                {/* 썸네일 변경 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                  title="썸네일 변경"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {/* 삭제 */}
                <button
                  onClick={() => { if (confirm('정말 삭제하시겠어요?')) deleteMutation.mutate() }}
                  disabled={deleteMutation.isPending}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-50"
                  title="삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* LP 바이닐 이미지 */}
          <div className="mx-auto mb-8 aspect-square w-full max-w-[470px] overflow-hidden rounded bg-[#2d3038] p-5 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-gray-900">
              {currentThumbnail ? (
                <img src={currentThumbnail} alt={lp.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-800 text-6xl">♪</div>
              )}
              <div className="absolute left-1/2 top-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-300 bg-gray-100" />
            </div>
          </div>

          {/* 내용 */}
          <p className="mx-auto mb-8 w-full max-w-[620px] whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-100">
            {lp.content}
          </p>

          {/* 태그 */}
          {tags.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-gray-100">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 좋아요 */}
          <button
            onClick={() => requireAuth(() => likeMutation.mutate(isLiked))}
            disabled={likeMutation.isPending}
            className="mx-auto mt-auto flex items-center gap-2 text-2xl font-semibold text-white disabled:opacity-70"
            aria-label="좋아요"
          >
            <span className={`text-4xl leading-none transition-colors ${isLiked ? 'text-pink-400' : 'text-gray-500'}`}>♥</span>
            <span>{likes.length}</span>
          </button>

          {/* 댓글 */}
          <CommentSection lpId={id} />
        </article>
      </div>
    </>
  )
}
