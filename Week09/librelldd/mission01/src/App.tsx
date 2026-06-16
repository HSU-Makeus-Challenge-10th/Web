import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import { Provider } from "react-redux";
import store from "./store/store";
import Modal from "./components/Modal";
import { useSelector } from "./hooks/useCustomRedux";
import { TotalPrice } from "./components/TotalPrice";


function AppContent() {
  const { isOpen } = useSelector((state) => state.modal);

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