import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LpDetailPage from "./pages/LpDetailPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const publicRoutes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Error</div>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
    ],
  },
];

const privateRoutes = [
  {
    path: "/mypage",
    element: <ProtectedLayout />,
    errorElement: <div>Error</div>,
    children: [{ index: true, element: <MyPage /> }],
  },
  {
    path: "/lp/:id",
    element: <ProtectedLayout />,
    errorElement: <div>Error</div>,
    children: [{ index: true, element: <LpDetailPage /> }],
  },
];

const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
