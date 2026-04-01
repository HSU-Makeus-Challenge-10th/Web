import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar.tsx";

const HomePage = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <Outlet key={location.pathname}/>
    </>
  );
};

export default HomePage;
