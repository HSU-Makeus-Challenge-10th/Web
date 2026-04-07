import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-gray-800 text-xl font-bold hover:text-pink-600">
            돌려돌려 LP판
          </NavLink>

          <div className="flex space-x-2">
            <NavLink
              to="/login"
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              로그인
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-pink-500 text-white px-3 py-1 rounded text-sm hover:bg-pink-600 transition-colors"
            >
              회원가입
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
