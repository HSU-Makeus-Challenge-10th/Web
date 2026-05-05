import { Link } from "react-router-dom";
import { HamburgerButton } from "./HamburgerButton";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyInfo } from "../api/auth";
import { Search } from "lucide-react";

interface NavbarProps {
  onToggle: () => void;
}

const Navbar = ({ onToggle }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (accessToken) {
        try {
          const response = await getMyInfo();
          if (response?.data?.name) {
            setUserName(response.data.name);
          }
        } catch (error) {
          console.error("유저 정보를 불러오는데 실패했습니다.", error);
        }
      }
    };
    fetchUserName();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
  }

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
