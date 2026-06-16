import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTotals } from './store/reducer/cartSlice';
import type { RootState } from './store/store';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';

function App() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      <Navbar />
      <CartContainer />
    </main>
  );
}

export default App;
