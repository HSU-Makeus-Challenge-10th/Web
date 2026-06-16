import { Outlet } from "react-router-dom";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import CreateLpModal from "../components/CreateLpModal";
import { SearchProvider } from "../context/SearchContext";
import { Sidebar } from "lucide-react";


const HomeLayout = () => {
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

export default HomeLayout;
