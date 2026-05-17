import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiCreateComment, apiDeleteComment, apiUpdateComment, fetchComments } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import type { SortOrder } from '../types/lp'

interface Props {
  lpId: number
}

export default function CommentSection({ lpId }: Props) {
  const queryClient = useQueryClient()
  const { user, status } = useAuth()

  const [commentInput, setCommentInput] = useState('')
  const [sort, setSort] = useState<SortOrder>('desc')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!openMenuId) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenuId])

  const { data: comments = [], isError } = useQuery({
    queryKey: ['comments', lpId, sort],
    queryFn: ({ signal }) => fetchComments(lpId, sort, signal),
    staleTime: 30 * 1000,
    retry: 1,
  })

  const createMutation = useMutation({
    mutationFn: (content: string) => apiCreateComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lpId] })
      setCommentInput('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      apiUpdateComment(lpId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lpId] })
      setEditingId(null)
      setEditContent('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => apiDeleteComment(lpId, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', lpId] }),
  })

  const handleSubmit = () => {
    const trimmed = commentInput.trim()
    if (!trimmed || createMutation.isPending) return
    createMutation.mutate(trimmed)
  }

  const startEdit = (id: number, currentContent: string) => {
    setEditingId(id)
    setEditContent(currentContent)
    setOpenMenuId(null)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const confirmEdit = (commentId: number) => {
    const trimmed = editContent.trim()
    if (!trimmed || updateMutation.isPending) return
    updateMutation.mutate({ commentId, content: trimmed })
  }

  const timeLabel = (createdAt: string) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
    if (diff < 1) return '방금 전'
    if (diff < 60) return `${diff}분 전`
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
    return `${Math.floor(diff / 1440)}일 전`
  }

  return (
    <section className="mt-8 border-t border-gray-700 pt-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">댓글</h2>
        <div className="inline-flex overflow-hidden rounded border border-gray-600 text-xs font-medium">
          <button
            onClick={() => setSort('asc')}
            className={`px-3 py-1 transition-colors ${sort === 'asc' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            오래된순
          </button>
          <button
            onClick={() => setSort('desc')}
            className={`border-l border-gray-600 px-3 py-1 transition-colors ${sort === 'desc' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 댓글 입력 */}
      {status === 'authenticated' && (
        <div className="mb-5 flex gap-2">
          <input
            type="text"
            placeholder="댓글을 입력해주세요"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 rounded-lg border border-gray-700 bg-[#1e1e2e] px-3 py-2 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending || !commentInput.trim()}
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 disabled:opacity-50"
          >
            작성
          </button>
        </div>
      )}

      {/* API 없을 때 안내 */}
      {isError && (
        <p className="mb-4 text-center text-xs text-gray-500">댓글을 불러올 수 없습니다.</p>
      )}

      {/* 댓글 목록 */}
      {!isError && (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => {
            const isOwn = !!user && user.id === comment.authorId
            const isEditing = editingId === comment.id

            return (
              <li key={comment.id} className="flex items-start gap-3">
                {/* 아바타 */}
                <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-600">
                  {comment.author.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white">{comment.author.name.slice(0, 1)}</span>
                  )}
                </div>

                {/* 내용 영역 */}
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold text-gray-200">{comment.author.name}</p>

                  {isEditing ? (
                    /* 수정 모드 */
                    <div className="flex items-center gap-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && confirmEdit(comment.id)}
                        className="flex-1 rounded-lg border border-gray-600 bg-[#1e1e2e] px-3 py-1.5 text-sm text-white outline-none focus:border-pink-500"
                      />
                      <button
                        onClick={() => confirmEdit(comment.id)}
                        disabled={updateMutation.isPending}
                        className="shrink-0 text-gray-300 hover:text-white disabled:opacity-50"
                        title="확인"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300">{comment.content}</p>
                  )}
                </div>

                {/* 시간 + 본인 메뉴 */}
                {!isEditing && (
                  <div className="flex shrink-0 items-center gap-2 pt-0.5">
                    <span className="text-xs text-gray-500">{timeLabel(comment.createdAt)}</span>

                    {isOwn && (
                      <div className="relative" ref={openMenuId === comment.id ? menuRef : undefined}>
                        {/* ⋮ 버튼 */}
                        <button
                          onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                          className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          ⋮
                        </button>

                        {/* 드롭다운: 수정/삭제 아이콘 */}
                        {openMenuId === comment.id && (
                          <div className="absolute right-0 top-7 z-20 flex items-center gap-1 rounded-lg border border-gray-700 bg-[#1c1c2e] p-1.5 shadow-xl">
                            <button
                              onClick={() => startEdit(comment.id, comment.content)}
                              className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-700 hover:text-white"
                              title="수정"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => { setOpenMenuId(null); deleteMutation.mutate(comment.id) }}
                              disabled={deleteMutation.isPending}
                              className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-700 hover:text-red-400 disabled:opacity-50"
                              title="삭제"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18" /><path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}

          {!isError && comments.length === 0 && (
            <li className="py-6 text-center text-sm text-gray-500">댓글이 없습니다.</li>
          )}
        </ul>
      )}
    </section>
  )
}
