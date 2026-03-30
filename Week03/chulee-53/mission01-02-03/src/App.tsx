import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/movies/:category',
        element: <MoviePage />,
      },
    ]
  },
  {
    path: '/movie/:id',
    element: <MovieDetailPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;