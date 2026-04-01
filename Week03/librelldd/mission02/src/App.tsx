import './App.css'
import MoviePage from './pages/MoviePage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import MovieDetailPage from './pages/MovieDetailPage';

//createBrowserRouter v6

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement:<NotFoundPage />,
    children: [
      {
        index: true,
        path: 'movies/:category',
        element: <MoviePage />,
        
      },
      {
        path: 'movies/details/:movieId', 
        element: <MovieDetailPage />
      }
    
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
  
 

};

export default App;