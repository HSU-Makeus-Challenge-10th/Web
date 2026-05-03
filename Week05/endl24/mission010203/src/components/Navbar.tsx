import { useNavigate, Link } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const {logout} = useAuth();
  const navigate = useNavigate();
  
  const isLoggedIn = !!localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  const handleLogout = async()=>{
    await logout();
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 cursor-pointer"
        >
          ← 뒤로가기
        </button>
        <Link to="/" className="font-bold text-xl text-blue-600 italic">MY APP</Link>
      </div>

      <div className="flex gap-6 items-center">
        {isLoggedIn ? (
          <>
            <Link to="/my" className="text-sm font-medium hover:text-blue-500">마이페이지</Link>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:underline cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:text-blue-500">로그인</Link>
            <Link to="/signup" className="text-sm font-medium hover:text-blue-500">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;