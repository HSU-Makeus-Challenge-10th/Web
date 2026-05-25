import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

export default function Navbar() {
    const { amount, cartItems } = useCartInfo();
    const { calculateTotals } = useCartActions();

    useEffect(() => {
        calculateTotals();
    }, [cartItems, calculateTotals]);

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <a href="/" className="text-xl font-semibold">
                Awesome
            </a>
            <div className="flex items-center gap-2">
                <FaShoppingCart className="text-xl" />
                <span className="text-xl font-medium">{amount}</span>
            </div>
        </nav>
    );
}