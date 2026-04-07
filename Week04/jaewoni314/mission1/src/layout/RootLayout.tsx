import { Outlet, useParams } from 'react-router-dom';
import Navbar from '../components/GNB/Navbar';

const RootLayout = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const isDetail = window.location.pathname.includes('/movies/' + movieId);
  return (
    <>
      {!isDetail && <Navbar />}
      <Outlet />
    </>
  );
};

export default RootLayout;
