import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function FloatingButton() {
  const { accessToken } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      nav(`/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`);
      return;
    }
    nav("/lp/new"); 
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center
                 rounded-full bg-pink-600 text-white shadow-[0_8px_25px_rgba(0,0,0,0.5)]
                 hover:bg-pink-500 active:scale-95 transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
