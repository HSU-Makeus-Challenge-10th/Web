import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black opacity-90 shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-white text-xl font-bold hover:text-pink-600">
            돌려돌려 LP판
          </NavLink>

          <div className="flex space-x-2">
            <NavLink
              to="/login"
              className="px-3 py-1 border border-gray-600 rounded text-sm text-gray-200 hover:bg-gray-800 transition-colors"
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
