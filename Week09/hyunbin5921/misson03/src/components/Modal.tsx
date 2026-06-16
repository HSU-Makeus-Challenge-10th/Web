import { useModalStore } from "../hooks/useModalStore";
import { useCartActions } from "../hooks/useCartStore";

const Modal = () => {
  const { isOpen, close } = useModalStore();
  const { clearCart } = useCartActions();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center"
        onClick={close}
      />

      {/* modal box */}
      <div className="fixed top-1/2 left-1/2 z-50
                      -translate-x-1/2 -translate-y-1/2
                      bg-white p-6 rounded-md w-80">
        <p className="text-center mb-6">
          장바구니를 전부 비울까?
        </p>

        <div className="flex justify-between">
          <button
            className="px-4 py-2 border"
            onClick={close}
          >
            아니요
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white"
            onClick={() => {
              clearCart();
              close();
            }}
          >
            네
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
