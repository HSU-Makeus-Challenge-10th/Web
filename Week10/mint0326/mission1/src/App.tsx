import { useState, useCallback, useMemo } from 'react';
import './App.css';
import MovieSearch from './components/MovieSearch';
import MovieList from './components/MovieList';
import MovieModal from './components/MovieModal';
import type { Movie } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState('ko-KR');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // VITE_TMDB_API_KEY 환경변수 사용 (없으면 에러)
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // 영화 검색 API 호출 함수 - useCallback으로 참조 고정
  const fetchMovies = useCallback(async () => {
    if (!query.trim()) return;

    if (!API_KEY) {
      alert("TMDB API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=${language}&page=1`;
      
      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      });
      
      const data = await response.json();
      if (data.results) {
        setMovies(data.results);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, includeAdult, language, API_KEY]); // 의존성 배열에 API 호출에 필요한 상태값들 포함

  // 모달 열기/닫기 핸들러 - useCallback으로 참조 고정
  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 평점 평균 계산 - useMemo로 연산 최적화 예시
  const averageRating = useMemo(() => {
    console.log("평점 평균 연산 수행");
    if (movies.length === 0) return 0;
    const total = movies.reduce((acc, movie) => acc + movie.vote_average, 0);
    return (total / movies.length).toFixed(1);
  }, [movies]);

  return (
    <div className="app-container">
      <header>
        <MovieSearch
          query={query}
          setQuery={setQuery}
          includeAdult={includeAdult}
          setIncludeAdult={setIncludeAdult}
          language={language}
          setLanguage={setLanguage}
          onSearch={fetchMovies}
        />
        {movies.length > 0 && (
          <div className="search-stats">
            <span>검색 결과: {movies.length}건</span>
            <span>평균 평점: ⭐️ {averageRating}</span>
          </div>
        )}
      </header>
      
      <main>
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <MovieList movies={movies} onMovieClick={handleMovieClick} />
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
