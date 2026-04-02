import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';
import { getTmdbHeaders } from '../apis/tmdb';


interface MoviesPageProps {
    category: string;
}

const MoviesPage = ({ category }: MoviesPageProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const { data } = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    {
                        headers: getTmdbHeaders(),
                    }
                );
                setMovies(data.results);
                setTotalPages(data.total_pages);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [category, page]);

    // 카테고리가 바뀌면 페이지를 1로 리셋
    useEffect(() => {
        setPage(1);
    }, [category]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
                <p className="text-xl">영화를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-2">에러가 발생했습니다</h1>
                <p className="text-gray-400 mb-6">데이터를 불러오는 중에 문제가 발생했습니다.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                    다시 시도하기
                </button>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen p-8 text-white">
            {/* 상단 페이지네이션 */}
            <div className="flex items-center justify-center space-x-6 mb-8 py-4 bg-gray-900 rounded-lg shadow-md border border-gray-800">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-red-700 rounded-md transition-all font-bold min-w-[100px]"
                >
                    이전
                </button>
                <span className="text-lg font-bold">
                    {page} / {totalPages > 500 ? 500 : totalPages} 페이지
                </span>
                <button
                    disabled={page >= totalPages || page >= 500}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-red-700 rounded-md transition-all font-bold min-w-[100px]"
                >
                    다음
                </button>
            </div>

            {/* 그리드 컨테이너 */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="group relative overflow-hidden rounded-lg bg-gray-900 shadow-lg border border-gray-800">
                        <img
                            src={movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                                : 'https://via.placeholder.com/500x750?text=No+Image'}
                            className="w-full h-auto transition-transform duration-300 group-hover:scale-110 group-hover:blur-sm"
                            alt={movie.title}
                        />
                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-4 justify-center">
                            <h2 className="font-bold text-lg mb-2">{movie.title}</h2>
                            <div className="flex items-center mb-2">
                                <span className="text-yellow-400 mr-1">⭐</span>
                                <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                            <p className="text-xs line-clamp-6 text-gray-200 leading-relaxed">{movie.overview || "설명이 없습니다."}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoviesPage;