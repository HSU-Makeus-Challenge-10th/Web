import { Link } from 'react-router-dom'

interface Props {
  isOpen: boolean
  close: () => void
  isAuthenticated: boolean
  onWithdraw: () => void
}

export default function Sidebar({ isOpen, close, isAuthenticated, onWithdraw }: Props) {
  return (
    <>
      {/* 어두운 오버레이 (backdrop) */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* 사이드바 패널 */}
      <aside
        className={`fixed left-0 top-12 z-30 flex h-[calc(100vh-3rem)] w-44 flex-col border-r border-gray-800 bg-[#111] py-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 헤더: 닫기 버튼 */}
        <div className="mb-4 flex items-center justify-between px-4">
          <span className="text-sm font-semibold text-gray-300">메뉴</span>
          <button
            onClick={close}
            aria-label="닫기"
            className="text-gray-400 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col gap-1 px-2">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            찾기
          </Link>
          <Link
            to="/mypage"
            onClick={close}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            마이페이지
          </Link>
        </nav>

        {/* 탈퇴하기 (인증된 경우만) */}
        {isAuthenticated && (
          <div className="mt-auto px-2">
            <button
              onClick={() => { close(); onWithdraw() }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-800 hover:text-red-400"
            >
              탈퇴하기
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
