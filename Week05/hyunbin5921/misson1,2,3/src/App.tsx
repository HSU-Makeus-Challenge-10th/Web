  import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
  } from "react-router-dom";
  import "./App.css";
  import LoginPage from "./pages/LoginPage";
  import SignUpPage from "./pages/SignupPage";
  import { AuthProvider } from "./context/AuthContext";
  import MyPage from "./pages/MyPage";
  import ProtectedLayout from "../src/layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirect";
import { HomePage } from "./pages/HomePage";
import HomeLayout from "./layouts/HomeLayouts";
import { NotFoundPage } from "./pages/NotFoundPage";

  const publicRoutes: RouteObject[] = [
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage/>},
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
          element: <MyPage />
        },
      ],
    },
  ];

  const router = createBrowserRouter([...publicRoutes, ...ProtectedRoutes]);

  function App() {
    return (
      <AuthProvider>
        <RouterProvider router={router} />;
      </AuthProvider>
    );
  }

  export default App;