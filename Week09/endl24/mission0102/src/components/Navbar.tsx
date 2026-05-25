import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import { calculateTotals } from "../slices/cartSlice";
import { FiHeadphones } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../hooks/useCustomRedux";

const Navbar = () => {
  const { amount, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        className="text -2xl font-semibold"
      >
        <FiHeadphones className="text-3xl text-emerald-400 group-hover:text-emerald-300 transition-colors" />
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
