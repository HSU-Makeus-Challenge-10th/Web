// import {
//   createBrowserRouter,
//   RouterProvider,
//   type RouteObject,
// } from "react-router-dom";

// import "./App.css";
// import { Navbar } from "./components/Navbar";
// import { Footer } from "./components/Footer";
// import HomePage from "./pages/HomePage";
// import NotFoundPage from "./pages/NotFoundPage";
// import LoginPage from "./pages/LoginPage";
// import HomeLayout from "./layouts/HomeLayout";
// import ProtectedLayout from "./layouts/ProtectedLayout";
// import SignupPage from "./pages/SignupPage";
// import MyPage from "./pages/MyPage";
// import { AuthProvider } from "./context/AuthContext";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// //publicRoutes 인증 없이 접근 가능한 라우트
// const publicRoutes: RouteObject[] = [
//   {
//     path: "/",
//     element: <HomeLayout />,
//     errorElement: <NotFoundPage />,
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//       {
//         path: "login",
//         element: <LoginPage />,
//       },
//       {
//         path: "signup",
//         element: <SignupPage />,
//       },
//     ],
//   },
// ];

// //protectedRoutes 인증이 필요한 라우트
// const protectedRoutes: RouteObject[] = [
//   {
//     path: "/",
//     element: <ProtectedLayout />,
//     errorElement: <NotFoundPage />,
//     children: [
//       {
//         path: "my",
//         element: <MyPage />, //일반적으로 protected route는 해당 페이지를 보여줍니다.
//       },
//     ],
//   },
// ];

// //모든 라우트를 병합하고 라우터에 전달
// const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

// export const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>
//       {import.meta.env.DEV && <ReactQueryDevtools initiallsOpen={false} />}
//     </QueryClientProvider>
//   );
// }

// export default App;
//
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

import "./App.css";
// import { Navbar } from "./components/Navbar"; // 사용되지 않음
// import { Footer } from "./components/Footer"; // 사용되지 않음
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import LpListScreen from "./pages/LpListScreen"; // LpListScreen 임포트
import LpDetailScreen from "./pages/LpDetailScreen"; // LpDetailScreen 임포트
import AuthGuard from "./components/AuthGuard"; // 🚀 ADDED: AuthGuard 임포트

import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//publicRoutes 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        // 기존 HomePage 대신 LpListScreen 연결
        element: <LpListScreen />,
      },
      // 🚀 MODIFIED: LP 상세 페이지를 AuthGuard로 보호합니다.
      {
        path: "lp/:lpid",
        element: (
          <AuthGuard>
            <LpDetailScreen />
          </AuthGuard>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
];

//protectedRoutes 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "my",
        element: <MyPage />, //일반적으로 protected route는 해당 페이지를 보여줍니다.
      },
    ],
  },
];

//모든 라우트를 병합하고 라우터에 전달
const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initiallsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
