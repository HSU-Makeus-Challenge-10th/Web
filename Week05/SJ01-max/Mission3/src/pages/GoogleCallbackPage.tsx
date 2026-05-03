import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { AuthTokens } from '../api/client'

/**
 * Google OAuth 콜백 페이지
 *
 * 백엔드가 리다이렉트해 오는 URL 형식:
 *   /auth/google/callback?accessToken=...&refreshToken=...
 *
 * 1. 쿼리 파라미터에서 토큰 추출
 * 2. 기존 login() 함수로 토큰 저장 + 유저 정보 fetch
 * 3. 메인 페이지(/)로 리다이렉트
 * 4. 파라미터 누락 시 /login으로 리다이렉트
 */
export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const processed = useRef(false) // StrictMode 이중 실행 방지

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (!accessToken || !refreshToken) {
      // 토큰이 없으면 로그인 페이지로
      navigate('/login', { replace: true })
      return
    }

    const tokens: AuthTokens = { accessToken, refreshToken }

    login(tokens)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login', { replace: true }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-pink-500" />
        <p className="text-sm text-gray-400">Google 로그인 처리 중...</p>
      </div>
    </div>
  )
}
