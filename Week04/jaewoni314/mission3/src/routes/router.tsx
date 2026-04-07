import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import RootLayout from '../layout/RootLayout';
import LogIn from '../pages/login/LogInPage';
import SignUp from '../pages/signup/SignUpPage';
import HomePage from '../pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'login',
        element: <LogIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
