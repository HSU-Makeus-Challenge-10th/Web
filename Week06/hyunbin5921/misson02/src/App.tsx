import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayouts";
import SignUpPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import MyPage from "./pages/MyPage";
import ProtectedLayout from "../src/layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LpDetailPage from "./pages/LpDetailPage";
import CommentsPage from "./pages/CommentPage";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      { path: "/lp/:lpid/comments", element: <CommentsPage /> },
    ],
  },
];

const ProtectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,

    children: [
      {
        path: "my",
        element: <MyPage />,
      },
      { path: "/lp/:lpid", element: <LpDetailPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...ProtectedRoutes]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />;
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
