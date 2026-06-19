import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage"; // 방금 만든 페이지

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<HomePage />} />
        {/* 영화 상세 페이지 동적 라우팅 */}
        <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;