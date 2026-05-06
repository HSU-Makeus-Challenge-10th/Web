import { Outlet, Link } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
          <Link to="/" className="text-pink-400 font-semibold tracking-tight">
            돌려돌려LP판
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm rounded-md border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800 transition"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="text-sm rounded-md bg-pink-500 px-3 py-1.5 font-medium text-black hover:bg-pink-400 transition"
            >
              회원가입
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow mx-auto max-w-6xl px-4 py-10 grid place-items-center">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        © 2025 LP
      </footer>
    </div>
  );
}