import { NavLink } from 'react-router-dom';

const navClassName = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-md transition-colors duration-200 ${
    isActive
      ? 'bg-pink-500 text-white font-semibold'
      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
  }`;

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-gray-800 text-xl font-bold hover:text-blue-600">
            MovieApp
          </NavLink>

          <div className="flex space-x-6">
            <NavLink to="/" className={navClassName}>
              홈
            </NavLink>

            <NavLink to="/popular" className={navClassName}>
              인기 영화
            </NavLink>

            <NavLink to="/upcoming" className={navClassName}>
              개봉 예정
            </NavLink>

            <NavLink to="/top-rated" className={navClassName}>
              평점 높은
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;