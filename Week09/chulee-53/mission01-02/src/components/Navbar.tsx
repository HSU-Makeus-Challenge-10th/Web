import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { calculateTotal } from "../slices/cartSlice";

export default function Navbar() {
    const { amount, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(calculateTotal());
    }, [dispatch, cartItems]);

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 onClick={() => {
                window.location.href = '/'
            }} className="text-xl font-semibold cursor-pointer">Awesome</h1>
            <div className="flex items-center gap-2">
                <FaShoppingCart className="text-xl" />
                <span className="text-xl font-medium">{amount}</span>
            </div>
        </nav>
    );
}