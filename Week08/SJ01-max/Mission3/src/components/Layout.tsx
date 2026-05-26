import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { apiSignout, apiWithdraw, AUTH_TOKENS_KEY } from '../api/client'
import LoginModal from './LoginModal'
import LpCreateModal from './LpCreateModal'
import Sidebar from './Sidebar'
import { useSidebar } from '../hooks/useSidebar'

export default function Layout() {
  const { status, user } = useAuth()
  const navigate = useNavigate()
  const { isOpen: sidebarOpen, open: openSidebar, close: closeSidebar, toggle: toggleSidebar } = useSidebar()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const autoClosedSidebar = useRef(false)

  useEffect(() => {
    const sidebarBreakpoint = 768
    const handleResize = () => {
      const currentWidth = window.innerWidth
      if (sidebarOpen && currentWidth < sidebarBreakpoint) {
        autoClosedSidebar.current = true
        closeSidebar()
      }
      if (!sidebarOpen && autoClosedSidebar.current && currentWidth >= sidebarBreakpoint) {
        autoClosedSidebar.current = false
        openSidebar()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen, closeSidebar, openSidebar])

  const logoutMutation = useMutation({
    mutationFn: apiSignout,
    onSettled: () => {
      localStorage.removeItem(AUTH_TOKENS_KEY)
      navigate('/login', { replace: true })
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: apiWithdraw,
    onSettled: () => {
      localStorage.removeItem(AUTH_TOKENS_KEY)
      setShowWithdrawModal(false)
      navigate('/login', { replace: true })
    },
  })

  const handleFloatingBtn = () => {
    if (status === 'unauthenticated') { setShowLoginModal(true); return }
    setShowCreateModal(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#111]">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showCreateModal && <LpCreateModal onClose={() => setShowCreateModal(false)} />}

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-72 rounded-xl bg-[#1e1e2e] p-6 shadow-2xl">
            <p className="mb-6 text-center text-sm font-medium text-white">
              정말 탈퇴하시겠습니까?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
                className="rounded-lg bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400 disabled:opacity-50"
              >
                예
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-600"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-b border-gray-800 bg-[#111] px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
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
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                로그아웃
              </button>
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
        <Sidebar
          isOpen={sidebarOpen}
          close={closeSidebar}
          isAuthenticated={status === 'authenticated'}
          onWithdraw={() => setShowWithdrawModal(true)}
        />

        {/* 메인 컨텐츠 */}
        <main id="main-content" className="relative flex-1 overflow-y-auto bg-black" style={{ height: 'calc(100vh - 3rem)' }}>
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
