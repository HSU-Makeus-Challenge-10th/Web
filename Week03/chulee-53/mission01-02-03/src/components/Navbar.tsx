import { NavLink } from "react-router-dom";

const LINKS = [
    { to: "/movies/popular", label: "인기" },
    { to: "/movies/top_rated", label: "최고 평점" },
    { to: "/movies/upcoming", label: "개봉 예정" },
]

export const Navbar = () => {
    return (
        <>
            <div className="flex justify-center items-center gap-4 bg-[#141413] text-white">
                {LINKS.map(({ to, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => isActive ? "cursor-pointer transition-all bg-[#262624] text-[#F3F4F4] px-6 py-2 rounded-xl border-[#141413] border-b-4 hover:bg-[#262624] active:brightness-90 duration-300" : "cursor-pointer transition-all bg-[#141413] text-[#F3F4F4] px-6 py-2 rounded-xl border-[#141413] border-b-4 hover:bg-[#262624] active:brightness-90 duration-300"}>{label}</NavLink>
                ))}
            </div>
        </>
    );
}