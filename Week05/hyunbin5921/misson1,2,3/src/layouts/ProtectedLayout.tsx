import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight text-pink-400">
            돌려돌려LP판
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800 transition"
            >
              홈
            </Link>
          </nav>
        </div>
      </header>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-20
        [background:radial-gradient(1000px_600px_at_50%_0%,#e879f966,transparent_60%),
        radial-gradient(800px_400px_at_0%_100%,#818cf866,transparent_60%)]"
      />

      <main className="flex-grow">
        <div className="mx-auto grid max-w-6xl place-items-center px-4 py-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        © 2025 LP
      </footer>
    </div>
  );
};

export default ProtectedLayout;