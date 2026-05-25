import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import Modal from "./components/Modal";
import { useModalInfo } from "./hooks/useModalStore";
import Footer from "./components/Footer";

function App() {
  const isOpen = useModalInfo();

  return (
    <>
      <Navbar />
      <CartList />
      <Footer />
      {isOpen && <Modal />}
    </>
  );
}

export default App;