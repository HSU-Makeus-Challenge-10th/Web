import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { status, user } = useAuth()

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 text-6xl">🎵</div>
      <h1 className="mb-2 text-3xl font-bold text-white">돌려돌려LP판</h1>
      <p className="mb-8 text-gray-400">나만의 LP를 공유하고 발견하세요</p>

      {status === 'authenticated' ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-300">
            안녕하세요,{' '}
            <span className="font-semibold text-pink-400">{user?.name}</span>님!
          </p>
          <Link
            to="/mypage"
            className="rounded-lg bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-400"
          >
            마이페이지 보기
          </Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-gray-600 px-6 py-3 text-sm text-white transition-colors hover:bg-gray-800"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-400"
          >
            회원가입
          </Link>
        </div>
      )}
    </div>
  )
}
