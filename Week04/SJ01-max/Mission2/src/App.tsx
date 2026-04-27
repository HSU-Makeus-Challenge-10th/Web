import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
