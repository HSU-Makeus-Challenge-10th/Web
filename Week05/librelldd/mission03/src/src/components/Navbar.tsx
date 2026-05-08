import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-[#f8f9fa] border-b border-[#e9ecef] px-10 py-2">
      {/* 메뉴 항목들을 담은 리스트 */}
      <ul className="flex justify-end items-center gap-4 text-sm text-gray-600">
        <li>

          <Link to="/login" className="hover:text-black transition-colors">
            로그인
          </Link>
        </li>
        <li className="text-gray-300">|</li>
        <li>
          <Link to="/signup" className="hover:text-black transition-colors">
            회원가입
          </Link>
        </li>
        <li className="text-gray-300">|</li>
        <li>
          <Link to="/support" className="hover:text-black transition-colors">
            고객센터
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;