import { useCartActions } from "../hooks/useCartStore";
import { useModalActions } from "../hooks/useModalStore";

export default function Modal() {
  const { clearCart } = useCartActions();
  const { close } = useModalActions();

  const handleConfirm = () => {
    clearCart();
    close();
  };

  const handleCancel = () => {
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 shadow-2xl transform transition-all scale-100 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          정말 삭제하시겠습니까?
        </h3>
        <div className="flex w-full gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
