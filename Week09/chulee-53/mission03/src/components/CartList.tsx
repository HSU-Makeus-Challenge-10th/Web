import CartItem from "./CartItem";
import { useCartItems } from "../hooks/useCartStore";

export default function CartList() {
    const cartItems = useCartItems();

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 mt-6">
            <div className="max-w-2xl w-full">
                {
                    cartItems.length === 0 ? (
                        <p className="flex justify-center text-xl font-bold mt-6 text-black">장바구니가 비어 있습니다.</p>
                    ) : (
                        <ul>
                            {cartItems.map((item) => (
                                <CartItem key={item.id} lp={item} />
                            ))}
                        </ul>
                    )
                }
            </div>
        </div>
    )
}