import type { Lp } from "../types/cart";
import { useCartActions } from "../hooks/useCartStore";

interface ICartItemProps {
    lp: Lp;
}

const CartItem = ({ lp }: ICartItemProps) => {
    const { increase, decrease, removeItem } = useCartActions();

    const handleIncrease = () => {
        increase(lp.id);
    };

    const handleDecrease = () => {
        if (lp.amount > 1) {
            decrease(lp.id);
        } else {
            removeItem(lp.id);
        }
    };

    return (
        <li className="flex items-center p-4 border-b border-gray-200">
            <img
                src={lp.img}
                alt={`${lp.title}의 Lp 이미지`}
                className="w-20 h-20 object-cover rounded mr-4"
                loading="lazy"
                width={80}
                height={80}
            />
            <div className="flex-1">
                <h3 className="text-xl font-semibold">{lp.title}</h3>
                <p className="text-sm text-gray-600">{lp.singer}</p>
                <p className="text-sm font-bold text-gray-600 mt-1">{lp.price} 원</p>
            </div>
            <div className="flex items-center">
                <button onClick={handleDecrease} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer">-</button>
                <span className="px-3 py-1 border-y border-gray-300">{lp.amount}</span>
                <button onClick={handleIncrease} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400 cursor-pointer">+</button>
            </div>
        </li>
    )
}

export default CartItem;