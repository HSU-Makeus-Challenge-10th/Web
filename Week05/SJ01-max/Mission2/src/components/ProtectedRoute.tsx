import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * 인증이 필요한 페이지를 감싸는 컴포넌트
 *
 * - loading  → 로딩 스피너 표시
 * - unauthenticated → /login 으로 replace 리다이렉트
 * - authenticated → children 렌더링
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-pink-500" />
          <p className="text-sm text-gray-400">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
