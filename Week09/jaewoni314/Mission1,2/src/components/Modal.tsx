import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../store/modalSlice';
import { clearCart } from '../store/cartSlice';
import type { RootState, AppDispatch } from '../store/store';

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-6">정말 삭제하시겠습니까?</h2>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => dispatch(closeModal())}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 font-semibold rounded transition-colors cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-colors cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
