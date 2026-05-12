import { Link } from "react-router-dom";
import { HamburgerButton } from "./HamburgerButton";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import usePostLogout from "../hooks/mutations/usePostLogout";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

interface NavbarProps {
  onToggle: () => void;
}

const Navbar = ({ onToggle }: NavbarProps) => {
  const { accessToken } = useAuth();
  const logoutMutation = usePostLogout();
  
  // React Query를 통해 내 정보를 가져옵니다. accessToken이 있을 때만 요청합니다.
  const { data: myInfoResponse } = useGetMyInfo(!!accessToken);
  const userName = myInfoResponse?.data?.name;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-[#141517] z-50">
        <div className="flex items-center gap-4">
          <HamburgerButton onClick={onToggle} />
          <Link to="/" className="text-[#FF1E90] text-xl font-bold">
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {accessToken ? (
            <>
              <Search className="cursor-pointer text-white" size={20} />
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
              <Search className="cursor-pointer text-white" size={20} />
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
    </>
  );
};

export default Navbar;
