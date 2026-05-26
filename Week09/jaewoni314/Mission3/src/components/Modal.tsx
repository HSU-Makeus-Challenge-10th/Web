import { useModalStore } from '../store/useModalStore';
import { useCartStore } from '../store/useCartStore';

const Modal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);
  const clearCart = useCartStore((state) => state.clearCart);

  if (!isOpen) return null;

  const handleConfirm = () => {
    clearCart();
    closeModal();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
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
            onClick={closeModal}
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
