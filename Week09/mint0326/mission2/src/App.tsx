import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { calculateTotals } from './features/cart/cartSlice';
import type { RootState } from './store/store';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

function App() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state: RootState) => state.cart);
  const { isOpen } = useAppSelector((state: RootState) => state.modal);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </main>
  );
}

export default App;
