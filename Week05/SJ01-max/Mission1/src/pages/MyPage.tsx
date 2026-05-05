import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-white">
          마이페이지
        </h1>

        {/* 프로필 카드 */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          {user?.bio && (
            <p className="mt-2 text-sm text-gray-300">{user.bio}</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg border border-gray-700 py-3 text-sm text-gray-300 transition-colors hover:border-red-700 hover:text-red-400"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
