import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  type AuthTokens,
  type User,
  AUTH_TOKENS_KEY,
  apiGetMe,
  apiSignout,
} from '../api/client'

// ── 타입 ──────────────────────────────────────────────────

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: (tokens: AuthTokens) => Promise<void>
  logout: () => Promise<void>
}

// ── Context ───────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  // 앱 최초 마운트: localStorage 토큰으로 /users/me 호출해 유효성 확인
  // 인터셉터가 401 → refresh → 재시도까지 처리하므로
  // 여기서는 최종 성공/실패만 확인하면 된다.
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
        // refresh도 실패했거나 토큰이 없는 경우
        localStorage.removeItem(AUTH_TOKENS_KEY)
        setStatus('unauthenticated')
      }
    }

    checkAuth()
  }, [])

  // storage 이벤트 감지: 인터셉터가 토큰을 제거하면 다른 탭·인터셉터에서 로그아웃 처리
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_TOKENS_KEY && e.newValue === null) {
        setUser(null)
        setStatus('unauthenticated')
        navigate('/login', { replace: true })
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [navigate])

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

// ── useAuth 훅 ────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
