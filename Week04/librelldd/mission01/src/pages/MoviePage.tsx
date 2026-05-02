import { useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch"; // 1. 훅 임포트

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    // 2. 복잡한 로직 대신 이 한 줄로 데이터를 가져옵니다!
    const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;
    const { data, isPending, isError } = useCustomFetch<MovieResponse>(url);

    // 데이터가 오기 전까진 빈 배열로 처리
    const movies = data?.results || [];

    if (isError) {
        return <div className="text-red-500 text-center mt-10">에러가 발생했습니다.</div>;
    }
    

    return (
        <> 
            
            <div className='flex items-center justify-center gap-6 mt-5'>
                <button 
                    className=' bg-purple-900 text-white px-6 py-3 rounded-lg disabled:bg-purple-900'
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}>
                    {'<'}
                </button>
                <span className="text-white font-Pretendard text-sm">{page} 페이지</span>
                <button 
                    className=' bg-purple-700 text-white px-6 py-3 rounded-lg'
                    onClick={() => setPage((prev) => prev + 1)}>
                    {'>'}
                </button>
            </div>
            

            
            {isPending ? (
                <div className='flex items-center justify-center h-screen'>
                    <LoadingSpinner />
                </div>
            ) : (
                <div className='p-10 grid gap-9 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'> 
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </> 
    );
}