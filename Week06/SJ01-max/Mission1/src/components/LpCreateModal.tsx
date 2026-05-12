import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreateLp, apiUpdateLp, apiUploadFile } from '../api/client'
import type { LpDetail, Tag } from '../types/lp'

interface Props {
  onClose: () => void
  editLp?: {
    id: number
    title: string
    content: string
    thumbnail: string | null
    tags: Tag[]
  }
}

export default function LpCreateModal({ onClose, editLp }: Props) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(editLp?.thumbnail ?? null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState(editLp?.title ?? '')
  const [content, setContent] = useState(editLp?.content ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(editLp?.tags.map((t) => t.name) ?? [])

  const isEdit = !!editLp

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let thumbnail: string | null = editLp?.thumbnail ?? null

      if (file) {
        try {
          thumbnail = await apiUploadFile(file)
        } catch {
          // 업로드 실패 시 기존 thumbnail 유지 또는 null
        }
      }

      if (isEdit) {
        return apiUpdateLp(editLp.id, {
          title,
          content,
          thumbnail,
          published: true,
        })
      }

      return apiCreateLp({
        title,
        content,
        thumbnail,
        tags: tags.map((name) => ({ name })),
        published: true,
      })
    },
    onSuccess: (data: LpDetail) => {
      queryClient.invalidateQueries({ queryKey: ['lps'] })
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ['lp', String(editLp.id)] })
      }
      onClose()
      return data
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput('')
  }

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    mutate()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl bg-[#1e1e2e] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          ✕
        </button>

        {/* LP 이미지 (파일 업로드) */}
        <div className="mb-5 flex justify-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-gray-700 bg-gray-900 hover:opacity-80 transition-opacity"
            >
              {preview ? (
                <img src={preview} alt="LP 썸네일" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                  <span className="text-4xl text-gray-500">♪</span>
                </div>
              )}
              {/* 중앙 홀 */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-600 bg-gray-800" />
            </button>
            {/* 업로드 아이콘 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500 text-white shadow hover:bg-pink-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 입력 필드 */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b border-gray-600 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-b border-gray-600 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 border-b border-gray-600 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
            />
            <button
              onClick={handleAddTag}
              className="rounded bg-gray-700 px-3 py-1.5 text-xs text-white hover:bg-gray-600"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gray-700 px-2.5 py-1 text-xs text-gray-200"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 leading-none text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
          className="mt-5 w-full rounded-lg bg-gray-700 py-2.5 text-sm font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
        >
          {isPending ? '처리 중...' : isEdit ? 'Update LP' : 'Add LP'}
        </button>
      </div>
    </div>
  )
}
