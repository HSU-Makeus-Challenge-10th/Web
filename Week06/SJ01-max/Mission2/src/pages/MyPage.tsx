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
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">마이페이지</h1>

      <div className="rounded-xl bg-gray-900 p-6">
        {/* 아바타 */}
        <div className="mb-4 flex justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700 text-3xl">
              👤
            </div>
          )}
        </div>

        {/* 유저 정보 */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-4 py-3">
            <span className="w-16 text-gray-400">이름</span>
            <span className="text-white">{user?.name}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-4 py-3">
            <span className="w-16 text-gray-400">이메일</span>
            <span className="text-white">{user?.email}</span>
          </div>
          {user?.bio && (
            <div className="flex items-start gap-3 rounded-lg bg-gray-800 px-4 py-3">
              <span className="w-16 text-gray-400">소개</span>
              <span className="text-white">{user.bio}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg bg-gray-700 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
