import CartItem from "./CartItem";
import { useCartInfo } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const CartList = () => {
  const { cartItems } = useCartInfo();
  const { open } = useModalStore();

  const handleAllClearButton = () => {
    open();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {cartItems.length === 0 && (
        <div className="my-10">
          <p className="text-2xl font-semibold">
            장바구니가 비어있습니다.
          </p>
        </div>
      )}

      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>

      {cartItems.length > 0 && (
        <button
          onClick={handleAllClearButton}
          className="p-4 border rounded-md my-10 cursor-pointer"
        >
          전체삭제
        </button>
      )}
    </div>
  );
};

export default CartList;
