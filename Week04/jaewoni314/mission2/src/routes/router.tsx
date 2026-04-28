import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import RootLayout from '../layout/RootLayout';
import LogIn from '../pages/login/LogInPage';
import HomePage from '../pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/login',
        element: <LogIn />,
      },
    ],
  },
]);

export default router;
