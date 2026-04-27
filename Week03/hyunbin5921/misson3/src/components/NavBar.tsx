import { NavLink } from "react-router-dom"

const LINKS = [
  { to: "/", label: "홈", end: true },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중인 영화" },
  { to: "/movies/top_rated", label: "평점 높은 영화" },
  { to: "/movies/upcoming", label: "개봉 예정 영화" },
]

export const NavBar = () => {
  return (
    <nav className="bg-black border-b border-black">
      <div className="mx-auto max-w-7xl px-4 py-3 flex gap-5">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end as any}
            className={({ isActive }) =>
              isActive
                ? "text-[#b2dab1] font-bold"
                : "text-white/70 hover:text-white"
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}