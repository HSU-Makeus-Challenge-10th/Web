import { useState } from 'react';
import useCustomFetch from '../hooks/useCustomFetch';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { MovieListResponse } from '../types/movie';

const CATEGORIES = [
  { label: '현재 상영중', value: 'now_playing' },
  { label: '인기 영화', value: 'popular' },
  { label: '최고 평점', value: 'top_rated' },
  { label: '개봉 예정', value: 'upcoming' },
] as const;

type Category = (typeof CATEGORIES)[number]['value'];

export default function MovieListPage() {
  const [category, setCategory] = useState<Category>('popular');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCustomFetch<MovieListResponse>(
    `/movie/${category}`,
    { page },
  );

  const handleCategoryChange = (value: Category) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-gray-900/90">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">🎬</span>
          <h1 className="text-xl font-bold text-white">MovieApp</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat.value
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data?.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {data && data.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  이전
                </button>
                <span className="text-gray-400 text-sm">
                  <span className="text-white font-bold">{page}</span> / {Math.min(data.total_pages, 500)}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                  disabled={page >= data.total_pages || page >= 500}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
