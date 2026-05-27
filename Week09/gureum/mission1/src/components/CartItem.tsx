import { FiTrash2 } from 'react-icons/fi';
import { decrease, increase, removeItem } from '../features/cart/cartSlice';
import { useAppDispatch } from '../store/hooks';
import type { CartItem as CartItemType } from '../types/cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();

  return (
    <article className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <img
        src={item.img}
        alt={`${item.title} 이미지`}
        className="h-20 w-20 rounded-md object-cover"
      />

      <div className="min-w-0">
        <p className="truncate text-base font-semibold">{item.title}</p>
        <p className="truncate text-sm text-gray-500">{item.singer}</p>
        <p className="mt-1 text-sm font-bold text-blue-700">{Number(item.price).toLocaleString()}원</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(decrease(item.id))}
          className="h-8 w-8 rounded-md border border-gray-300 text-sm font-bold hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-semibold">{item.amount}</span>
        <button
          type="button"
          onClick={() => dispatch(increase(item.id))}
          className="h-8 w-8 rounded-md border border-gray-300 text-sm font-bold hover:bg-gray-100"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => dispatch(removeItem(item.id))}
          className="ml-1 rounded-md p-2 text-red-500 hover:bg-red-50"
          aria-label="아이템 제거"
        >
          <FiTrash2 />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
