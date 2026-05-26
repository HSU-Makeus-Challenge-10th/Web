import CartContainer from "./components/CartContainer";
import { useAppSelector } from "./hooks/redux";

export default function App() {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 h-[76px] bg-[#1d2a3a] text-white shadow-sm">
        <div className="flex h-full items-center justify-between px-4">
          <h1 className="text-[34px] font-extrabold tracking-[-0.01em]">
            Ohtani Ahn
          </h1>
          <div className="flex items-center gap-2 text-[26px] font-extrabold">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-8 w-8 fill-current"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14.75c-.75 0-1.41-.41-1.75-1.03L1.8 7H0V4.8h3.12l.94 2H20.5c.76 0 1.24.82.86 1.48l-3.58 6.47H7.17ZM6.1 9l2.05 3.75h8.45L18.67 9H6.1Z" />
            </svg>
            <span>{amount}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1216px]">
        <CartContainer />
      </main>
    </div>
  );
}
