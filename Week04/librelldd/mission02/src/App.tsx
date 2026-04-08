import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // 로그인 페이지 경로 확인!
import SignupPage from './pages/SignupPage';

// 1. 경로 설정을 해줍니다.
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, // 처음 접속하면 로그인 페이지가 보이게 설정
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

function App() {
  // 2. 반드시 RouterProvider를 리턴해야 화면이 바뀝니다.
  return <RouterProvider router={router} />;
}

export default App;