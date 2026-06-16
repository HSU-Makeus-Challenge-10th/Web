import { Provider } from "react-redux";
import "./App.css";
import CartList from "./components/CartList";
import Navbar from "./components/Navbar";
import store from "./store/store";
import Modal from "./components/Modal";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <Modal />
      <CartList />
    </Provider>
  );
}

export default App;
