import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '홈' },
  { to: '/movies/popular', label: '인기 영화' },
  { to: '/movies/now_playing', label: '상영 중' },
  { to: '/movies/top_rated', label: '평점 높은' },
  { to: '/movies/upcoming', label: '개봉 예정' },
];

export default function Navbar() {
  return (
    <nav className="px-6 py-4">
      <ul className="flex gap-3 text-[13px] text-zinc-500">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'rounded px-1 transition-colors',
                  isActive
                    ? 'font-semibold text-zinc-800'
                    : 'text-zinc-500 hover:text-zinc-700',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

