import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 p-3 sm:p-4 text-black border-b">
      <Link to="/" className="px-2 py-1 text-sm sm:text-base whitespace-nowrap">
        홈
      </Link>
      <Link
        to="/movies"
        className="px-2 py-1 text-sm sm:text-base whitespace-nowrap"
      >
        인기 영화
      </Link>
      <Link
        to="/movies/now-playing"
        className=" px-2 py-1 text-sm sm:text-base whitespace-nowrap"
      >
        현재 상영작
      </Link>
      <Link
        to="/movies/top-rated"
        className="px-2 py-1 text-sm sm:text-base whitespace-nowrap"
      >
        평점 높은 영화
      </Link>
      <Link
        to="/movies/upcoming"
        className="px-2 py-1 text-sm sm:text-base whitespace-nowrap"
      >
        개봉 예정작
      </Link>
    </nav>
  );
};

export default Navbar;
