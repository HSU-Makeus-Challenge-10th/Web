import { createBrowserRouter, RouterProvider, type RouteObject, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import { AuthProvider } from './context/AuthContext';
import HomeLayout from './layouts/HomeLayout';
import LpDetailPage from './pages/LpDetailPage';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThrottlePage from './pages/ThrottlePage';


const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
  { path: "lp/:lpid", element: <LpDetailPage /> },
  { path: "throttle", element: <ThrottlePage /> },
];

const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    children: [
      { path: "my", element: <MyPage /> }
    ]
  }
];



export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,

    }
  }
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <HomeLayout />,
        children: [
          ...publicRoutes,
          ...protectedRoutes,
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;