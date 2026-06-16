import { useEffect } from 'react';
import useStore from './store/useStore';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

function App() {
  const { cartItems, isOpen, calculateTotals } = useStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </main>
  );
}

export default App;
