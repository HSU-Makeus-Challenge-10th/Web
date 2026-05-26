import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const amount = useCartStore((state) => state.amount);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">WON</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-lg">{amount}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
