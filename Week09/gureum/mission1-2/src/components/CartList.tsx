import { useEffect } from 'react';
import { calculateTotals } from '../features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { openModal } from '../features/modal/modalSlice';
import CartItem from './CartItem';

const CartList = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  const handleDeleteClick = () => {
    dispatch(openModal());
  };

  if (cartItems.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-bold">장바구니가 비어있습니다</h2>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="space-y-3">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-sm sm:text-base">
          <span className="font-semibold">총 수량: {amount}개</span>
          <span className="font-bold text-blue-700">총 금액: {total.toLocaleString()}원</span>
        </div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
        >
          전체 삭제
        </button>
      </div>
    </section>
  );
};

export default CartList;
