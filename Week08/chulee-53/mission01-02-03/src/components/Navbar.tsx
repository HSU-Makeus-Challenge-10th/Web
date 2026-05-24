import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HamburgerButton } from "./HamburgerButton";
import { useAuth } from "../context/AuthContext";
import { Search, X, ChevronDown } from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import usePostLogout from "../hooks/mutations/usePostLogout";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

interface NavbarProps {
  onToggle: () => void;
}

const Navbar = ({ onToggle }: NavbarProps) => {
  const { accessToken } = useAuth();
  const logoutMutation = usePostLogout();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const debouncedSearch = useDebounce(searchValue, SEARCH_DEBOUNCE_DELAY);
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    
    setSearchParams(debouncedSearch ? { search: debouncedSearch } : {});
  }, [debouncedSearch, setSearchParams]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchValue("");
      setSearchParams({});
    }
  };

  // React Query를 통해 내 정보를 가져옵니다. accessToken이 있을 때만 요청합니다.
  const { data: myInfoResponse } = useGetMyInfo(!!accessToken);
  const userName = myInfoResponse?.data?.name;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col bg-[#141517]">
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <HamburgerButton onClick={onToggle} />
          <Link to="/" className="text-[#FF1E90] text-xl font-bold">
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {accessToken ? (
            <>
              {isSearchOpen ? (
                <X className="cursor-pointer text-white transition-colors" size={24} onClick={toggleSearch} />
              ) : (
                <Search className="cursor-pointer text-white hover:text-[#FF1E90] transition-colors" size={20} onClick={toggleSearch} />
              )}
              <Link
                to="/mypage"
                className="text-white hover:text-gray-300 text-md"
              >
                {userName ? `${userName}님 안녕하세요.` : "로딩 중..."}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#1f1f1f] cursor-pointer hover:bg-[#292929] text-white px-4 py-2 rounded-md text-md"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              {isSearchOpen ? (
                <X className="cursor-pointer text-white transition-colors" size={24} onClick={toggleSearch} />
              ) : (
                <Search className="cursor-pointer text-white hover:text-[#FF1E90] transition-colors" size={20} onClick={toggleSearch} />
              )}
              <Link
                to="/login"
                className="text-white hover:text-gray-300 text-md"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-[#FF1E90] text-white px-4 py-2 rounded-md text-md"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
        }`}
      >
        <div className="flex justify-center mt-2">
          <div className="flex flex-col w-[50%]">
            <div className="flex items-center border-b border-white pb-3 mb-6">
              <Search className="text-white mr-3 shrink-0" size={24} />
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="" 
                className="w-full bg-transparent text-white text-lg outline-none"
              />
              <button className="flex items-center gap-1 border border-white rounded-lg px-3 py-1 ml-4 text-white text-sm shrink-0 hover:bg-[#292929] transition-colors cursor-pointer">
                제목 <ChevronDown size={16} />
              </button>
            </div>
            
            
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm">최근 검색어</span>
              <button className="text-gray-400 text-xs hover:text-white transition-colors cursor-pointer">모두 지우기</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
