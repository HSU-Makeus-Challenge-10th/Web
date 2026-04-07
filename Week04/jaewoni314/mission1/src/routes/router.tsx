import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import PopularPage from '../pages/movie/PopularPage';
import NowPlayingPage from '../pages/movie/NowPlayingPage';
import TopRatedPage from '../pages/movie/TopRatedPage';
import UpcomingPage from '../pages/movie/UpcomingPage';
import DetailPage from '../pages/movie/DetailPage';
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
      {
        path: 'movies/:movieId',
        element: <DetailPage />,
      },
    ],
  },
]);

export default router;
