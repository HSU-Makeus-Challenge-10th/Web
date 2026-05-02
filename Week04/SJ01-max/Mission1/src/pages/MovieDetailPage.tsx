import { useParams, Link } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { MovieDetail } from '../types/movie';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

function formatCurrency(amount: number) {
  if (!amount) return '정보 없음';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRuntime(minutes: number) {
  if (!minutes) return '정보 없음';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, error } = useCustomFetch<MovieDetail>(`/movie/${id}`);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <header className="bg-gray-900/90 border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm">목록으로</span>
          </Link>
          <span className="text-gray-700">|</span>
          <span className="text-2xl">🎬</span>
          <h1 className="text-xl font-bold text-white">MovieApp</h1>
        </div>
      </header>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : movie ? (
        <>
          {/* 배경 이미지 */}
          {movie.backdrop_path && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={`${BACKDROP_BASE}${movie.backdrop_path}`}
                alt=""
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/60 to-gray-950" />
            </div>
          )}

          <main className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 포스터 */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                {movie.poster_path ? (
                  <img
                    src={`${POSTER_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-52 rounded-xl shadow-2xl shadow-black/60 -mt-24 relative z-10 border border-gray-700"
                  />
                ) : (
                  <div className="w-52 aspect-[2/3] rounded-xl bg-gray-800 flex items-center justify-center -mt-24 relative z-10 border border-gray-700">
                    <span className="text-5xl">🎬</span>
                  </div>
                )}
              </div>

              {/* 상세 정보 */}
              <div className="flex-1 min-w-0">
                {/* 제목 & 태그라인 */}
                <h2 className="text-3xl font-bold text-white leading-tight">{movie.title}</h2>
                {movie.tagline && (
                  <p className="text-rose-400 italic mt-1 text-sm">&ldquo;{movie.tagline}&rdquo;</p>
                )}

                {/* 메타 정보 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* 평점 & 통계 */}
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-yellow-400">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs mt-1">{movie.vote_count.toLocaleString()}명 평가</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">개봉일</span>
                    <span className="text-white font-medium">{movie.release_date || '미정'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">상영 시간</span>
                    <span className="text-white font-medium">{formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">상태</span>
                    <span className="text-white font-medium">{movie.status}</span>
                  </div>
                </div>

                {/* 줄거리 */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">줄거리</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {movie.overview || '줄거리 정보가 없습니다.'}
                  </p>
                </div>

                {/* 제작비 & 수익 */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-xs mb-1">제작비</p>
                    <p className="text-white font-semibold">{formatCurrency(movie.budget)}</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-xs mb-1">총 수익</p>
                    <p className="text-white font-semibold">{formatCurrency(movie.revenue)}</p>
                  </div>
                </div>

                {/* 제작사 */}
                {movie.production_companies.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">제작사</h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.production_companies.map((company) => (
                        <div
                          key={company.id}
                          className="bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-700"
                        >
                          {company.logo_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              className="h-5 object-contain filter invert brightness-75"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">{company.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      ) : null}
    </div>
  );
}
