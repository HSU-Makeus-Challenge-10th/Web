import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { clearCart } from "../slices/cartSlice";

const PriceBox = () => {
    const { total } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return (
        <div className="flex items-center justify-center gap-4">
            <div className="border p-2 rounded-lg border-neutral-700">
                <button className="cursor-pointer" onClick={handleClearCart}>
                    장바구니 비우기
                </button>
            </div>
            <p>총 가격: {total}원</p>
        </div>
    )
}

export default PriceBox