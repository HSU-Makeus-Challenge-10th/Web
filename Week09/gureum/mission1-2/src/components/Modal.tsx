import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

export default function Modal() {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 레이어 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 모달 박스 */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <p className="mb-6 text-center text-gray-700">정말 삭제하시겠습니까?</p>

        {/* 버튼 컨테이너 */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg border-2 border-gray-300 py-2 font-semibold text-gray-700 hover:bg-gray-100"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 font-semibold text-white hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
