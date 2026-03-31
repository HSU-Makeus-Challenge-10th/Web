import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import PopularPage from '../pages/PopularPage';
import NowPlayingPage from '../pages/NowPlayingPage';
import TopRatedPage from '../pages/TopRatedPage';
import UpcomingPage from '../pages/UpcomingPage';
import RootLayout from '../layout/RootLayout';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies',
        element: <PopularPage />,
      },
      {
        path: 'movies/now-playing',
        element: <NowPlayingPage />,
      },
      {
        path: 'movies/top-rated',
        element: <TopRatedPage />,
      },
      {
        path: 'movies/upcoming',
        element: <UpcomingPage />,
      },
    ],
  },
]);

export default router;
