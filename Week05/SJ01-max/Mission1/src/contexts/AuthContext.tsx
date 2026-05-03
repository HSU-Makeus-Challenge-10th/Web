import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { type AuthTokens, type User, apiGetMe, apiSignout } from '../api/client'

// ── 타입 정의 ─────────────────────────────────────────────

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: (tokens: AuthTokens) => Promise<void>
  logout: () => Promise<void>
}

// ── Context 생성 ───────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_TOKENS_KEY = 'auth_tokens'

// ── Provider ───────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  // 앱 최초 마운트 시: localStorage에 토큰이 있으면 /users/me 로 유효성 확인
  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem(AUTH_TOKENS_KEY)

      if (!stored) {
        setStatus('unauthenticated')
        return
      }

      try {
        const me = await apiGetMe()
        setUser(me)
        setStatus('authenticated')
      } catch {
        // 토큰이 만료되었거나 유효하지 않으면 제거 후 미인증 처리
        localStorage.removeItem(AUTH_TOKENS_KEY)
        setStatus('unauthenticated')
      }
    }

    checkAuth()
  }, [])

  // 로그인 성공 후 토큰 저장 + 사용자 정보 fetch
  const login = useCallback(async (tokens: AuthTokens) => {
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens))
    try {
      const me = await apiGetMe()
      setUser(me)
      setStatus('authenticated')
    } catch {
      localStorage.removeItem(AUTH_TOKENS_KEY)
      setStatus('unauthenticated')
      throw new Error('로그인 후 사용자 정보를 가져오는 데 실패했습니다.')
    }
  }, [])

  // 로그아웃: 서버에 signout 요청 + 로컬 상태 초기화
  const logout = useCallback(async () => {
    try {
      await apiSignout()
    } catch {
      // 서버 오류가 발생해도 로컬 상태는 초기화
    }
    localStorage.removeItem(AUTH_TOKENS_KEY)
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── useAuth 훅 ─────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
