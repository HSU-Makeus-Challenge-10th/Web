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

function VinylDisc({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls =
    size === 'sm' ? 'h-20 w-20' : size === 'lg' ? 'h-40 w-40' : 'h-32 w-32'
  return (
    <div className={`${cls} relative shrink-0 rounded-full bg-[#111] shadow-inner`}>
      <div className="absolute inset-[12%] rounded-full border border-gray-700" />
      <div className="absolute inset-[22%] rounded-full border border-gray-700" />
      <div className="absolute inset-[32%] rounded-full border border-gray-700" />
      <div className="absolute left-1/2 top-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300">
        <div className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111]" />
      </div>
    </div>
  )
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
        try { thumbnail = await apiUploadFile(file) } catch { /* 업로드 실패 시 유지 */ }
      }
      if (isEdit) return apiUpdateLp(editLp.id, { title, content, thumbnail, published: true })
      return apiCreateLp({ title, content, thumbnail, tags, published: true })
    },
    onSuccess: (data: LpDetail) => {
      queryClient.invalidateQueries({ queryKey: ['lps'] })
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['lp', String(editLp.id)] })
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
    if (trimmed && !tags.includes(trimmed)) setTags((prev) => [...prev, trimmed])
    setTagInput('')
  }

  const handleRemoveTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="relative w-full max-w-xs overflow-hidden rounded-2xl bg-[#1c1c1e] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#3a3a3c] text-gray-300 hover:text-white"
        >
          ✕
        </button>

        {/* 이미지 + 바이닐 */}
        <div
          className="relative flex h-44 cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <>
              <img src={preview} alt="LP 썸네일" className="h-full flex-1 object-cover" />
              <div className="flex items-center justify-center bg-[#1c1c1e] px-2">
                <VinylDisc size="md" />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#2c2c2e]">
              <VinylDisc size="lg" />
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {/* 입력 필드 */}
        <div className="flex flex-col gap-2.5 px-5 pt-4 pb-5">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#3a3a3c] bg-[#2c2c2e] px-4 py-2.5 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-[#3a3a3c] bg-[#2c2c2e] px-4 py-2.5 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 rounded-lg border border-[#3a3a3c] bg-[#2c2c2e] px-4 py-2.5 text-sm text-white outline-none placeholder-gray-500 focus:border-pink-500"
            />
            <button
              onClick={handleAddTag}
              className="rounded-lg bg-[#3a3a3c] px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-[#48484a]"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-[#3a3a3c] px-2.5 py-1 text-xs text-gray-300">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}

          {!isEdit && tags.length === 0 && (
            <p className="text-center text-xs text-red-400">태그를 1개 이상 추가해주세요</p>
          )}
          <button
            onClick={() => { if (title.trim() && (isEdit || tags.length > 0)) mutate() }}
            disabled={isPending || !title.trim() || (!isEdit && tags.length === 0)}
            className="mt-1 w-full rounded-xl bg-pink-500 py-3 text-sm font-bold text-white hover:bg-pink-400 disabled:opacity-50"
          >
            {isPending ? '처리 중...' : isEdit ? 'Update LP' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  )
}
