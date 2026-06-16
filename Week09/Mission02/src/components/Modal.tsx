import { clearCart } from "../features/cart/cartSlice";
import { closeModal } from "../features/modal/modalSlice";
import { useAppDispatch } from "../hooks/redux";

export default function Modal() {
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/25 px-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-cart-title"
        className="w-full max-w-[294px] rounded-lg bg-white px-8 py-9 text-center shadow-xl"
      >
        <h2 id="delete-cart-title" className="text-[21px] font-extrabold text-black">
          정말 삭제하시겠습니까?
        </h2>

        <div className="mt-7 flex justify-center gap-5">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="rounded-md bg-slate-200 px-6 py-3 text-lg font-bold text-slate-700 transition hover:bg-slate-300"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-red-500 px-6 py-3 text-lg font-bold text-white transition hover:bg-red-600"
          >
            네
          </button>
        </div>
      </section>
    </div>
  );
}
