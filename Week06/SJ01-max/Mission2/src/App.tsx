import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LpListPage from './pages/LpListPage'
import LpDetailPage from './pages/LpDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import LpCreatePage from './pages/LpCreatePage'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">로딩 중...</div>
  }
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LpListPage />} />
        <Route path="lps" element={<LpListPage />} />
        <Route path="lps/:lpid" element={<LpDetailPage />} />
        <Route
          path="mypage"
          element={
            <RequireAuth>
              <MyPage />
            </RequireAuth>
          }
        />
        <Route
          path="lp/new"
          element={
            <RequireAuth>
              <LpCreatePage />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
