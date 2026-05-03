import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'

// ── 네비게이션 바 ────────────────────────────────────────────

function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-white">
          🎵 LP판
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white transition-colors hover:border-gray-500"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-400"
          >
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  )
}

// ── 앱 레이아웃 ──────────────────────────────────────────────

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 보호된 라우트: 로그인한 사용자만 접근 가능 */}
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

// ── 루트 컴포넌트 ────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      {/*
        AuthProvider가 BrowserRouter 안에 위치해야
        AuthContext에서 navigate 등을 사용할 수 있습니다.
      */}
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  )
}
