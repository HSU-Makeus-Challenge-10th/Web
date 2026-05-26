import { useNavigate, useLocation } from 'react-router-dom'

interface LoginModalProps {
  onClose?: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleConfirm = () => {
    onClose?.()
    navigate('/login', { state: { from: location }, replace: true })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 rounded-xl bg-[#1e1e1e] p-6 shadow-2xl">
        <p className="mb-6 text-center text-sm text-gray-300">
          로그인이 필요한 서비스입니다.
          <br />
          로그인을 해주세요!
        </p>
        <button
          onClick={handleConfirm}
          className="w-full rounded-lg bg-pink-500 py-2.5 text-sm font-semibold text-white hover:bg-pink-400"
        >
          확인
        </button>
      </div>
    </div>
  )
}
