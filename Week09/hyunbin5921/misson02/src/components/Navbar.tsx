import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotals } from "../slices/cartSlice";
import type { RootState } from "../store/store";

const Navbar = () => {
  const dispatch = useDispatch();

  const { amount, cartItems } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        className="text-2xl font-semibold cursor-pointer"
      >
        MusicCartList
      </h1>

      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
