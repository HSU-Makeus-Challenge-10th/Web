import { useAppDispatch, useAppSelector } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";

const Modal = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.modal);
  const handleinitializeCart = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="bg-white text-gray-800 p-6 rounded-lg max-w-sm w-full text-center space-y-4 shadow-xl">
        <h3 className="text-lg font-bold">장바구니를 비우시겠습니까?</h3>

        <div className="flex justify-center space-x-3">
          <button
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            취소
          </button>
          <button
            onClick={handleinitializeCart}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
