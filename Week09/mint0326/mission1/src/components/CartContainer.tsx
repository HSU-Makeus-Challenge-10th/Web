import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import CartListItem from './CartListItem';
import { clearCart } from '../store/reducer/cartSlice';

const CartContainer = () => {
  const dispatch = useDispatch();
  const { cartItems, total, amount } = useSelector((state: RootState) => state.cart);

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[calc(100vh-80px)] flex flex-col items-center pt-24 text-center">
        <header>
          <h2 className="text-3xl font-bold uppercase mb-4 tracking-widest text-gray-700">당신의 장바구니</h2>
          <h4 className="text-gray-500 text-lg">장바구니가 비어 있습니다</h4>
        </header>
      </section>
    );
  }

  return (
    <section className="w-[90vw] max-w-[800px] mx-auto mt-12 px-4 pb-20">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold uppercase tracking-widest text-gray-700">당신의 장바구니</h2>
      </header>
      <div>
        {cartItems.map((item) => (
          <CartListItem key={item.id} {...item} />
        ))}
      </div>
      <footer className="mt-8 border-t border-gray-300 pt-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold text-gray-700">총 수량</h4>
          <h4 className="text-xl font-bold text-gray-800">{amount} 개</h4>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold text-gray-700">총 금액</h4>
          <h4 className="text-xl font-bold text-gray-800">₩ {total.toLocaleString()}</h4>
        </div>
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-red-100 text-red-600 rounded uppercase font-semibold tracking-widest hover:bg-red-200 transition-colors border border-red-300"
            onClick={() => dispatch(clearCart())}
          >
            장바구니 전체 삭제
          </button>
        </div>
      </footer>
    </section>
  );
};

export default CartContainer;
