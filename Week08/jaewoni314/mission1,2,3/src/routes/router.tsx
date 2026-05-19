import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import RootLayout from '../layout/RootLayout';
import LogIn from '../pages/auth/login/LogInPage';
import SignUp from '../pages/auth/signup/SignUpPage';
import HomePage from '../pages/home/HomePage';
import MyPage from '../pages/mypage/MyPage';
import ProtectedRoute from '../layout/ProtectedRoute';
import GoogleLoginRedirectPage from '../pages/auth/GoogleLoginRedirectPage';
import LpDetailPage from '../pages/lpDetail/LpDetailPage';
import SearchPage from '../pages/search/SearchPage';

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
        path: 'search',
        element: <SearchPage />,
      },

      // 구글 로그인 리다이렉트
      {
        path: 'auth/google/redirect',
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
        ],
      },
    ],
  },
]);

export default router;