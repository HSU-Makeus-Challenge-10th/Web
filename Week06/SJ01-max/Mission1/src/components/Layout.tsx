import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'

export default function Layout() {
  const { status, user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const autoClosedSidebar = useRef(false)

  useEffect(() => {
    const sidebarBreakpoint = 768

    const handleResize = () => {
      const currentWidth = window.innerWidth

      if (sidebarOpen && currentWidth < sidebarBreakpoint) {
        autoClosedSidebar.current = true
        setSidebarOpen(false)
      }

      if (!sidebarOpen && autoClosedSidebar.current && currentWidth >= sidebarBreakpoint) {
        autoClosedSidebar.current = false
        setSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleFloatingBtn = () => {
    if (status === 'unauthenticated') { setShowLoginModal(true); return }
    navigate('/lp/new')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#111]">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-b border-gray-800 bg-[#111] px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-gray-400 hover:text-white"
            aria-label="메뉴"
          >
            <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
            </svg>
          </button>
          <Link to="/" className="text-xl font-bold text-pink-500">DOLIGO</Link>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {status === 'authenticated' ? (
            <>
              <span className="text-gray-300">{user?.name}님 반갑습니다.</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">로그인</Link>
              <Link to="/signup" className="rounded-lg bg-pink-500 px-3 py-1 font-medium text-white hover:bg-pink-400">회원가입</Link>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 pt-12">
        {/* 사이드바 */}
        <>
          {/* 오버레이 */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={[
              'fixed left-0 top-12 z-30 h-[calc(100vh-3rem)] w-44 border-r border-gray-800 bg-[#111] py-4 transition-all duration-200',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            <nav className="flex flex-col gap-1 px-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                찾기
              </Link>
              <Link
                to="/mypage"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                마이페이지
              </Link>
            </nav>
          </aside>
        </>

        {/* 메인 컨텐츠 */}
        <main id="main-content" className="relative flex-1 bg-black">
          <Outlet />

          {/* 우측 하단 플로팅 버튼 */}
          <button
            onClick={handleFloatingBtn}
            className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-2xl text-white shadow-lg hover:bg-pink-400 active:scale-95 transition-transform"
            aria-label="새 LP 추가"
          >
            +
          </button>
        </main>
      </div>
    </div>
  )
}
