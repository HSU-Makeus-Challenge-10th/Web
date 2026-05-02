import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Layout from './layouts/Layout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Error</div>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "mypage", element: <MyPage /> },
    ]
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
