import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import './App.css';
import HomePage from './pages/HomePage';

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />

          {/* 로그인한 사용자만 접근 가능한 보호되는 경로들 */}
          <Route element={<ProtectedRoute />}>
            {/* 나중에 마이페이지, LP 작성 페이지 등을 아래에 추가하세요. */}
            <Route path="/my" element={<MyPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
