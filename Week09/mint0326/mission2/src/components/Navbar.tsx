import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Navbar = () => {
  const { amount } = useSelector((state: RootState) => state.cart);

  return (
    <nav className="bg-[#1f2937] px-8 py-4 w-full flex justify-between items-center text-white">
      <h3 className="text-xl font-bold">UMC PlayList</h3>
      <div className="relative flex items-center">
        <ShoppingCart className="w-8 h-8" />
        <div className="absolute -top-2 -right-2 bg-[#ff007f] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {amount}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
