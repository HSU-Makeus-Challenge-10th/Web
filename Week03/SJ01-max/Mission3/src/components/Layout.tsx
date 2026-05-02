import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#050816] text-zinc-50">
      <header className="border-b border-zinc-800 bg-[#050816]/90 px-8 py-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-zinc-50">
            TMDB Movies
          </Link>
          <span className="text-xs text-zinc-400">Mission 3 • 상세 페이지</span>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
