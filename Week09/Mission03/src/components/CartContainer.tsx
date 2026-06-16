import CartItem from "./CartItem";
import { usePlaylistStore } from "../store/usePlaylistStore";

const formatWon = (price: number) => `${price.toLocaleString("ko-KR")}원`;

export default function CartContainer() {
  const { amount, cartItems, openModal, total } = usePlaylistStore();

  if (cartItems.length === 0) {
    return (
      <section className="px-6 py-24 text-center text-slate-900">
        <h2 className="text-3xl font-extrabold">장바구니가 비었습니다.</h2>
        <p className="mt-4 text-lg font-semibold text-slate-500">
          전체 수량 {amount}개 · 총 금액 {formatWon(total)}
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-[900px] px-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mx-auto max-w-[900px] px-4 py-10">
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-bold text-slate-500">총 결제 금액</p>
            <p className="text-3xl font-black text-slate-900">{formatWon(total)}</p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="self-center rounded-md border-2 border-slate-900 px-8 py-4 text-xl font-extrabold text-slate-900 transition hover:bg-slate-900 hover:text-white sm:self-auto"
          >
            전체 삭제
          </button>
        </div>
      </div>
    </section>
  );
}
