import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import RootLayout from '../layout/RootLayout';
import LogIn from '../pages/auth/login/LogInPage';
import SignUp from '../pages/auth/signup/SignUpPage';
import HomePage from '../pages/home/HomePage';
import MyPage from '../pages/MyPage';
import ProtectedRoute from '../layout/ProtectedRoute';
import GoogleLoginRedirectPage from '../pages/auth/GoogleLoginRedirectPage';
import LpDetailPage from '../pages/lpDetail/LpDetailPage';
import PostLpPage from '../pages/post/PostLpPage';

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
      {
        path: 'v1/auth/google/callback',
        element: <GoogleLoginRedirectPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'mypage',
            element: <MyPage />,
          },
          {
            path: 'lp/:lpId',
            element: <LpDetailPage />,
          },
          {
            path: 'lp/create',
            element: <PostLpPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
