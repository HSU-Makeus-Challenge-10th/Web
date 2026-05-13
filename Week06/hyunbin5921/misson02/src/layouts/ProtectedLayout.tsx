import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  if (!accessToken) {
    if (!sessionStorage.getItem("alertShown")) {
      alert("로그인이 필요합니다.");
      sessionStorage.setItem("alertShown", "true"); 
    }

    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (sessionStorage.getItem("alertShown")) {
    sessionStorage.removeItem("alertShown");
  }
  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 mt-15">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
