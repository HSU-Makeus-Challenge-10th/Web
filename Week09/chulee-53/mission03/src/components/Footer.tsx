import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { openModal } from "../features/modal/modalSlice";

const Footer = () => {
    const { total } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleClearCart = () => {
        dispatch(openModal());
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-6">
            <div className="border px-2 py-4 rounded-lg border-neutral-700">
                <button className="cursor-pointer" onClick={handleClearCart}>
                    전체 삭제
                </button>
            </div>
            <p>총 가격: {total}원</p>
        </div>
    )
}

export default Footer;