import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<div className="flex items-center justify-center min-h-screen text-2xl">Home Page (LP판 목록 등이 들어갈 자리)</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
