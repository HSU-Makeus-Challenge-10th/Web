import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'

export default function LpCreatePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await apiClient.post('/lps', {
        title,
        content,
        thumbnail: thumbnail || null,
        published: true,
      })
      navigate(`/lp/${data.data.id}`, { replace: true })
    } catch {
      setError('LP 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">새 LP 만들기</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-lg bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="url"
          placeholder="썸네일 URL (선택)"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="rounded-lg bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-500"
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className="resize-none rounded-lg bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-500"
        />
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-400 disabled:opacity-50"
        >
          {loading ? '생성 중...' : 'LP 만들기'}
        </button>
      </form>
    </div>
  )
}
