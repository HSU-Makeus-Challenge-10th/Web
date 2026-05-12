interface LoginRequiredModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LoginRequiredModal = ({ onConfirm, onCancel }: LoginRequiredModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-sm w-full mx-4 text-center space-y-4">
      <h3 className="text-white text-lg font-bold">로그인이 필요합니다</h3>
      <p className="text-gray-400 text-sm">LP 상세 페이지를 보려면 로그인이 필요합니다.</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800 transition-colors text-sm"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white transition-colors text-sm"
        >
          확인
        </button>
      </div>
    </div>
  </div>
);

export default LoginRequiredModal;
