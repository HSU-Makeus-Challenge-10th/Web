import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuthMutations } from "../hooks/mutations/useAuthMutations";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!accessToken;
  const { logoutMutation } = useAuthMutations();
  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };
  const { data: userData } = useGetMyInfo();
  const user = userData?.data;

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-1 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate(-1)}
          className="hidden sm:block px-3 py-1 text-sm border rounded hover:bg-gray-50 cursor-pointer"
        >
          ← 뒤로가기
        </button>
        <Link to="/" className="font-bold text-xl text-blue-600 italic">
          MY APP
        </Link>
      </div>

      <div className="flex gap-6 items-center">
        {isLoggedIn ? (
          <>
            {user ? (
              <h4 className="text-sm font-semibold text-gray-700">
                <span className="text-blue-600">{user.name}</span>님 환영합니다
              </h4>
            ) : (
              <span className="text-sm text-gray-400">불러오는 중...</span>
            )}
            <Link to="/my" className="text-sm font-medium hover:text-blue-500">
              마이페이지
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:underline cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-blue-500"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium hover:text-blue-500"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
