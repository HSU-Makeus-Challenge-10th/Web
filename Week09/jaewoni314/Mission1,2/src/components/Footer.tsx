import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../store/modalSlice';
import type { RootState, AppDispatch } from '../store/store';

const Footer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  if (cartItems.length === 0) return null;

  return (
    <footer className="flex justify-center">
        <button
          onClick={() => dispatch(openModal())}
          className="px-4 py-4 border rounded-lg hover:bg-red-300 cursor-pointer transition-colors"
        >
          전체 삭제
        </button>
    </footer>
  );
};

export default Footer;