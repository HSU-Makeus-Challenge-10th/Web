import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import DetailPage from './pages/DetailPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: 'popular',
                element: <MoviesPage category="popular" />,
            },
            {
                path: 'upcoming',
                element: <MoviesPage category="upcoming" />,
            },
            {
                path: 'top-rated',
                element: <MoviesPage category="top_rated" />,
            },
            {
                path: 'now-playing',
                element: <MoviesPage category="now_playing" />,
            },
            {
                path: 'movies/:movieId',
                element: <DetailPage />,
            },

        ],
    },
]);


function App() {
    return <RouterProvider router={router} />;
}

export default App;
