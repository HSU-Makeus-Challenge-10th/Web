import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiGetMe } from '../api/client'

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [log, setLog] = useState<string[]>([])
  const [elapsed, setElapsed] = useState(0)

  // 경과 시간 타이머
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString()
    setLog((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 20))
  }

  // /users/me를 수동으로 호출 — 인터셉터가 토큰 갱신을 투명하게 처리한다
  const handleTestRequest = async () => {
    addLog('GET /users/me 요청 시작...')
    try {
      const me = await apiGetMe()
      addLog(`✅ 성공: ${me.name} (${me.email})`)
    } catch {
      addLog('❌ 실패: 토큰 갱신에도 실패했거나 서버 오류')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          마이페이지
        </h1>

        {/* 프로필 카드 */}
        <div className="mb-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* 토큰 갱신 테스트 패널 */}
        <div className="mb-4 rounded-xl border border-gray-700 bg-gray-900/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300">
              🔄 토큰 자동 갱신 테스트
            </h2>
            <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
              로그인 후 {elapsed}초 경과
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            JWT_EXPIRES_IN=30s 설정 시 30초 후 요청하면 자동으로 토큰이 갱신됩니다.
          </p>
          <button
            onClick={handleTestRequest}
            className="w-full rounded-lg bg-pink-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-400"
          >
            API 요청 테스트 (GET /users/me)
          </button>

          {/* 로그 뷰어 */}
          {log.length > 0 && (
            <div className="mt-3 rounded-lg border border-gray-700 bg-black p-3">
              {log.map((entry, i) => (
                <p
                  key={i}
                  className={`font-mono text-xs ${
                    entry.includes('✅')
                      ? 'text-green-400'
                      : entry.includes('❌')
                        ? 'text-red-400'
                        : 'text-gray-400'
                  }`}
                >
                  {entry}
                </p>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-gray-700 py-3 text-sm text-gray-300 transition-colors hover:border-red-700 hover:text-red-400"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
