import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Layout from './layouts/Layout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';

const publicRoutes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Error</div>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> }
    ]
  },
]

const privateRoutes = [
  {
    path: "/mypage",
    element: <ProtectedLayout />,
    errorElement: <div>Error</div>,
    children: [
      { index: true, element: <MyPage /> }
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
