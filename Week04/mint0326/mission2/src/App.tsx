import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<div className="flex items-center justify-center min-h-screen text-2xl">Home Page (LP판 목록 등이 들어갈 자리)</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<div className="flex items-center justify-center min-h-screen text-2xl">Signup Page</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
