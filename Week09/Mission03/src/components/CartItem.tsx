import type { CartItem as CartItemType } from "../constants/cartItems";
import { usePlaylistStore } from "../store/usePlaylistStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { decrease, increase } = usePlaylistStore();

  return (
    <article className="grid grid-cols-[94px_minmax(0,1fr)] items-center gap-5 border-b border-slate-200 py-[19px] sm:grid-cols-[94px_minmax(0,1fr)_124px]">
      <img
        src={item.img}
        alt={`${item.title} album cover`}
        className="h-[94px] w-[94px] rounded object-cover"
      />

      <div className="min-w-0">
        <h2 className="truncate text-[24px] font-extrabold leading-tight text-black">
          {item.title}
        </h2>
        <p className="mt-1 truncate text-[17px] font-medium leading-tight text-slate-500">
          {item.singer}
        </p>
        <p className="mt-1 text-[20px] font-extrabold leading-tight text-slate-800">
          ${item.price}
        </p>
      </div>

      <div className="col-span-2 flex justify-end sm:col-span-1">
        <div className="grid grid-cols-[36px_46px_36px] overflow-hidden rounded bg-white text-[18px] font-bold text-slate-900">
          <button
            type="button"
            onClick={() => decrease(item.id)}
            className="h-9 bg-slate-300 transition hover:bg-slate-400"
            aria-label={`${item.title} 수량 감소`}
          >
            -
          </button>
          <span className="grid h-9 place-items-center border border-slate-200 bg-white">
            {item.amount}
          </span>
          <button
            type="button"
            onClick={() => increase(item.id)}
            className="h-9 bg-slate-300 transition hover:bg-slate-400"
            aria-label={`${item.title} 수량 증가`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
