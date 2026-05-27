import { useAppDispatch } from '../store/hooks';
import { removeItem, increase, decrease } from '../features/cart/cartSlice';
import type { CartItemType } from '../constants/cartItems';

const CartListItem = ({ id, img, title, singer, price, amount }: CartItemType) => {
  const dispatch = useAppDispatch();

  return (
    <article className="flex justify-between items-center mb-6 py-4 border-b border-gray-200">
      <div className="flex gap-4">
        <img src={img} alt={title} className="w-20 h-20 object-cover" />
        <div className="flex flex-col justify-center">
          <h4 className="font-bold text-lg">{title}</h4>
          <h4 className="text-gray-500 text-sm mb-1">{singer}</h4>
          <h4 className="font-semibold text-gray-700">₩ {Number(price).toLocaleString()}</h4>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-300 transition-colors"
          onClick={() => {
            if (amount === 1) {
              dispatch(removeItem(id));
              return;
            }
            dispatch(decrease(id));
          }}
        >
          <span className="text-lg font-bold">-</span>
        </button>
        <p className="w-6 text-center font-bold text-lg">{amount}</p>
        <button
          className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-300 transition-colors"
          onClick={() => dispatch(increase(id))}
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
    </article>
  );
};

export default CartListItem;
