import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import CreateLpModal from "../components/CreateLpModal";
import { SearchProvider } from "../context/SearchContext";
import { Sidebar } from "lucide-react";

export const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    alert("로그인이 필요합니다!")
    return <Navigate to={"/login"} replace />;
  }
  return (
    <SearchProvider>
      <div className="h-screen flex flex-col bg-black">
        <NavBar />

        <div className="flex flex-1 pt-16 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-black px-6 py-4">
            <Outlet />
          </main>
        </div>

        <Footer />
        <CreateLpModal/>
      </div>
    </SearchProvider>
  );
};
