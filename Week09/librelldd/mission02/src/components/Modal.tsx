import { useDispatch } from '../hooks/useCustomRedux';
import { closeModal } from '../modal/modalSlice';
import { useCartActions } from '../hooks/useCartStore'; 

const Modal = () => {
  const dispatch = useDispatch();
  const { clearCart } = useCartActions();

  // "네" 버튼: Zustand 장바구니를 비우고 Redux 모달을 닫음
  const handleConfirm = () => {
    clearCart(); 
    dispatch(closeModal());
  };

  // "아니요" 버튼: 모달만 닫음
  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">
          장바구니를 모두 비우시겠습니까?
        </h3>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleConfirm}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            네
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer rounded bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;