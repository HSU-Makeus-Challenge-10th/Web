import { useDispatch } from 'react-redux';
import { closeModal } from '../store/reducer/modalSlice';
import { clearCart } from '../store/reducer/cartSlice';

const Modal = () => {
  const dispatch = useDispatch();

  return (
    <aside className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-8 w-80 text-center shadow-lg">
        <h4 className="text-lg font-bold mb-6 text-gray-800">정말 삭제하시겠습니까?</h4>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
            onClick={() => dispatch(closeModal())}
          >
            아니요
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
          >
            네
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;
