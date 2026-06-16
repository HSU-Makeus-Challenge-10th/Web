import { useEffect } from "react"; 
import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import Modal from "./components/Modal";
import { useSelector } from "./hooks/useCustomRedux";
import { TotalPrice } from "./components/TotalPrice";
import { useCartActions, useCartInfo } from "./hooks/useCartStore"; 
import store from "./store/store";
import { Provider } from "react-redux";

function AppContent() {
  const { isOpen } = useSelector((state) => state.modal);
  const { cartItems } = useCartInfo();
  const { calculateTotals } = useCartActions();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <>
      <Navbar />
      <CartList />
      <TotalPrice />
      {isOpen && <Modal />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;