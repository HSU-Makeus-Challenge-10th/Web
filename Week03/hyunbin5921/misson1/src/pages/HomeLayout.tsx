import { Outlet } from "react-router-dom";
import { NavBar } from "../components/Navbar";

export const HomeLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};
