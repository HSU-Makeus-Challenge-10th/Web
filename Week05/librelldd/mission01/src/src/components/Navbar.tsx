const Navbar = () => {
  return (
    <nav className="w-full bg-[#f8f9fa] border-b border-[#e9ecef] px-10 py-2">
      {/* 메뉴 항목들을 담은 리스트 */}
      <ul className="flex justify-end items-center gap-4 text-sm text-gray-600">
        <li>
          <a href="/login" className="hover:text-black transition-colors">
            로그인
          </a>
        </li>
        <li className="text-gray-300">|</li> {/* 구분선 */}
        <li>
          <a href="/signup" className="hover:text-black transition-colors">
            회원가입
          </a>
        </li>
        <li>
          <a href="/support" className="hover:text-black transition-colors">
            고객센터
          </a>
        </li>
      </ul>
    </nav>
  );
};