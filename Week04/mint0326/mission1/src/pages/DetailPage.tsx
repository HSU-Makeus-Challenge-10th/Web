import { useParams, useNavigate } from 'react-router-dom';
import type { MovieDetail, MovieCredits } from '../types/movie';
import CrewSection from '../components/CrewSection';
import useCustomFetch from '../hooks/useCustomFetch';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const DetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();

    const {
        data: movie,
        isLoading: isMovieLoading,
        isError: isMovieError
    } = useCustomFetch<MovieDetail>(`/movie/${movieId}?language=ko-KR`);

    const {
        data: credits,
        isLoading: isCreditsLoading,
        isError: isCreditsError
    } = useCustomFetch<MovieCredits>(`/movie/${movieId}/credits?language=ko-KR`);

    const isLoading = isMovieLoading || isCreditsLoading;
    const isError = isMovieError || isCreditsError;

    if (isLoading) {
        return <LoadingSpinner text="영화 상세 정보를 불러오고 있습니다..." />;
    }

    if (isError || !movie) {
        return (
            <div className="min-h-screen bg-[#0b4747] pt-20 flex flex-col items-center justify-center">
                <ErrorDisplay message="영화 정보를 불러오는 데 실패했습니다. 일시적인 오류일 수 있으니 잠시 후 다시 시도해 주세요." />
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-8 py-3 bg-white text-[#0b4747] font-bold rounded-full hover:bg-gray-200 transition-all shadow-lg"
                >
                    이전 페이지로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b4747] pt-20 pb-20 text-white">
            {/* 상단 네비게이션/뒤로가기 */}
            <div className="max-w-7xl mx-auto px-6 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
                >
                    <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="font-medium">뒤로가기</span>
                </button>
            </div>

            {/* 히어로 섹션 */}
            <section className="relative w-full overflow-hidden">
                {/* 배경 이미지 블러 처리 */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt=""
                        className="w-full h-full object-cover blur-md opacity-30 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b4747] via-transparent to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10 py-10">
                    {/* 포스터 */}
                    <div className="flex-shrink-0 w-64 md:w-80 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-auto"
                        />
                    </div>

                    {/* 영화 상세 텍스트 */}
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{movie.title}</h1>
                        {movie.tagline && <p className="text-xl italic text-gray-300 mb-6 font-light">"{movie.tagline}"</p>}

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-8">
                            <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-md border border-yellow-500/50">
                                <span className="text-yellow-400 mr-1.5">⭐</span>
                                <span className="font-bold text-yellow-500">{(movie.vote_average ?? 0).toFixed(1)}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span>{movie.release_date.split('-')[0]}</span>
                            <span className="text-gray-400">|</span>
                            <span>{movie.runtime}분</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">줄거리</h2>
                            <p className="text-lg leading-relaxed text-gray-200">{movie.overview || "등록된 줄거리가 없습니다."}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map(genre => (
                                <span key={genre.id} className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium border border-white/5">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 출연진 및 제작진 섹션 */}
            <CrewSection credits={credits} />
        </div>
    );
};

export default DetailPage;