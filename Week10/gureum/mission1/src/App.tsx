import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PopularPage from './pages/PopularPage';
import UpcomingPage from './pages/UpcomingPage';
import TopRatedPage from './pages/TopRatedPage';
import MovieDetailPage from './pages/MovieDetailPage';
import './App.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="popular" element={<PopularPage />} />
      <Route path="upcoming" element={<UpcomingPage />} />
      <Route path="top-rated" element={<TopRatedPage />} />
      <Route path="movies/:movieId" element={<MovieDetailPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;