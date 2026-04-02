import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MovieCategoryPage from './pages/MovieCategoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/movies/popular"
          element={<MovieCategoryPage category="popular" title="인기 영화" />}
        />
        <Route
          path="/movies/now_playing"
          element={<MovieCategoryPage category="now_playing" title="상영 중" />}
        />
        <Route
          path="/movies/top_rated"
          element={<MovieCategoryPage category="top_rated" title="평점 높은" />}
        />
        <Route
          path="/movies/upcoming"
          element={<MovieCategoryPage category="upcoming" title="개봉 예정" />}
        />
      </Route>
    </Routes>
  );
}

export default App;

