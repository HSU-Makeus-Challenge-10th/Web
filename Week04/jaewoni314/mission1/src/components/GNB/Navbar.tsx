import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const baseStyle = 'px-2 py-1 text-sm sm:text-base whitespace-nowrap';
  const activeStyle = 'text-green-600 font-semibold ';
  const inactiveStyle = 'text-gray-700 hover:text-green-500';

  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 p-3 sm:p-4 text-black border">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
        end
      >
        홈
      </NavLink>
      <NavLink
        to="/movies"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
        end
      >
        인기 영화
      </NavLink>
      <NavLink
        to="/movies/now-playing"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        현재 상영작
      </NavLink>
      <NavLink
        to="/movies/top-rated"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        평점 높은 영화
      </NavLink>
      <NavLink
        to="/movies/upcoming"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        개봉 예정작
      </NavLink>
    </nav>
  );
};

export default Navbar;
