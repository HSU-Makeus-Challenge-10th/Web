import { Outlet } from 'react-router-dom';
import Navbar from '../components/GNB/Navbar';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
