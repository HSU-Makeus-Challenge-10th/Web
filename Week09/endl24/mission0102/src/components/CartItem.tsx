import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import type { Lp } from "../types/cart";
import { useAppDispatch } from "../hooks/useCustomRedux";
import { increase, decrease, removeItem } from "../slices/cartSlice";

interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
  const dispatch = useAppDispatch();
  const handleIncreaseCount = () => {
    dispatch(increase({ id: lp.id }));
  };
  const handleDecreaseCount = () => {
    if (lp.amount === 1) {
      dispatch(removeItem({ id: lp.id }));
      return;
    }
    dispatch(decrease({ id: lp.id }));
  };
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <img
        src={lp.img}
        alt={`${lp.title}의 LP 이미지`}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{lp.title}</h3>
        <p className="text-sm text-gray-600">{lp.singer}</p>
        <p className="text-sm font-bold text-gray-600">{lp.price} ₩</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDecreaseCount}
          className="px-2 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer"
        >
          <AiOutlineMinus />
        </button>
        <span className="px-3 border-y border-gray-300">{lp.amount}</span>
        <button
          onClick={handleIncreaseCount}
          className="px-2 py-1 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400 cursor-pointer"
        >
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
