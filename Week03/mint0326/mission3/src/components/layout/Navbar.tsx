import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
    const navItems = [
        { name: '홈', path: '/' },
        { name: '인기 영화', path: '/popular' },
        { name: '개봉 예정', path: '/upcoming' },
        { name: '평점 높은', path: '/top-rated' },
        { name: '상영 중', path: '/now-playing' },
    ];

    return (
        <nav className="bg-[#0b4747]/80 backdrop-blur-md text-white py-4 px-6 fixed top-0 w-full z-[100] border-b border-white/10 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                    MINT <span className="text-white/40">MOVIE</span>
                </Link>
                <ul className="hidden md:flex items-center space-x-10">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-sm font-bold tracking-tight transition-all duration-300 relative py-1 hover:text-white ${isActive
                                        ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                                        : 'text-white/50'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

