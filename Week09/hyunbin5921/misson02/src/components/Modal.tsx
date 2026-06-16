import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";
import type { RootState } from "../store/store";

const Modal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  // 모달 닫혀있으면 아예 렌더링 X
  if (!isOpen) return null;

  const handleYes = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleNo = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
      {/* 모달 박스 */}
      <div className="bg-white p-6 rounded-md">
        <p className="text-lg mb-4">장바구니를 모두 삭제할까요?</p>

        <div className="flex justify-end gap-4">
          <button onClick={handleNo} className="px-4 py-2 border rounded">
            아니요
          </button>

          <button
            onClick={handleYes}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
