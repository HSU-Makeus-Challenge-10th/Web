import CartItem from "./CartItem";
import { useSelector } from "../hooks/useCustomRedux";

export default function CartList() {
    const { cartItems } = useSelector((state) => state.cart);

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 mt-6">
            <div className="max-w-2xl w-full">
                {cartItems.map((item) =>
                    <CartItem key={item.id} lp={item} />
                )}
            </div>
        </div>
    )
}