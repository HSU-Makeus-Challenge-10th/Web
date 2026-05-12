import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { type AuthTokens, type User, AUTH_TOKENS_KEY, apiGetMe, apiSignout } from '../api/client'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: (tokens: AuthTokens) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (!localStorage.getItem(AUTH_TOKENS_KEY)) { setStatus('unauthenticated'); return }
      try {
        setUser(await apiGetMe())
        setStatus('authenticated')
      } catch {
        localStorage.removeItem(AUTH_TOKENS_KEY)
        setStatus('unauthenticated')
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_TOKENS_KEY && e.newValue === null) {
        setUser(null); setStatus('unauthenticated'); navigate('/login', { replace: true })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [navigate])

  const login = useCallback(async (tokens: AuthTokens) => {
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens))
    try {
      setUser(await apiGetMe()); setStatus('authenticated')
    } catch {
      localStorage.removeItem(AUTH_TOKENS_KEY); setStatus('unauthenticated')
      throw new Error('사용자 정보를 가져오는 데 실패했습니다.')
    }
  }, [])

  const logout = useCallback(async () => {
    try { await apiSignout() } catch { /* 무시 */ }
    localStorage.removeItem(AUTH_TOKENS_KEY); setUser(null); setStatus('unauthenticated')
  }, [])

  return <AuthContext.Provider value={{ status, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
