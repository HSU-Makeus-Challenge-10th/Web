import { useCartStore } from '../store/useCartStore';
import { useModalStore } from '../store/useModalStore';

const Footer = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const openModal = useModalStore((state) => state.openModal);

  if (cartItems.length === 0) return null;

  return (
    <footer className="flex justify-center">
        <button
          onClick={openModal}
          className="px-4 py-4 border rounded-lg hover:bg-red-300 cursor-pointer transition-colors"
        >
          전체 삭제
        </button>
    </footer>
  );
};

export default Footer;