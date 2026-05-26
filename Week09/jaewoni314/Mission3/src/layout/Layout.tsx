import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto py-8 px-4">
        <Outlet />
      </main>
      <Footer />
      <Modal />
    </div>
  );
};

export default MainLayout;
