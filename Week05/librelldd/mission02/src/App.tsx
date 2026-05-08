import { createBrowserRouter, RouterProvider, type RouteObject, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import { AuthProvider } from './context/AuthContext';


const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
];

const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "my",
        element: <MyPage />,
      }
    ]
  }
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;