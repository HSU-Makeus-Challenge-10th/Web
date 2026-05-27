import { FaShoppingCart } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';

const Navbar = () => {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <h1 className="text-xl font-bold">UMC Cart</h1>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
          <FaShoppingCart />
          <span className="text-sm font-semibold">{amount}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
