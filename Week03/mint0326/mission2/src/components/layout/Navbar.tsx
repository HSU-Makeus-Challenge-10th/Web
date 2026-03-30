import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const navItems = [
        { name: '홈', path: '/' },
        { name: '인기 영화', path: '/popular' },
        { name: '개봉 예정', path: '/upcoming' },
        { name: '평점 높은', path: '/top-rated' },
        { name: '상영 중', path: '/now-playing' },
    ];

    return (
        <nav className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-2xl font-bold text-red-600">MINT MOVIE</div>
                <ul className="flex space-x-6">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `transition-colors hover:text-red-400 ${
                                        isActive ? 'text-red-500 font-bold' : ''
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
