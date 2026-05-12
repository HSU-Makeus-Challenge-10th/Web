import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiSignin } from '../api/client'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const tokens = await apiSignin({ email, password })
      await login(tokens)
      navigate(from, { replace: true })
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-white">로그인</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-500"
          />
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-400 disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-pink-400 hover:text-pink-300">회원가입</Link>
        </p>
      </div>
    </div>
  )
}
