import { useState } from "react";
import MovieCard from "../components/MovieCard";
import type { MovieResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {
    const [page, setPage] = useState(1);

    const { category } = useParams<{
        category: string;
    }>();

    const { data, pending, error } = useCustomFetch<MovieResponse>(
        category ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}&region=KR` : ""
    );

    const movies = data?.results || [];

    if (error) {
        return <div className="bg-[#141413] min-h-screen text-white text-center pt-20">
            데이터를 불러오는데 실패했습니다. ㅠㅠ
        </div>
    }

    if (pending) {
        return (
            <div className="bg-[#141413] min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <>
            <div className="bg-[#2C2C2C] min-h-screen">
                <div className="pt-10 flex justify-center items-center gap-4">
                    <button className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all bg-[#141413] text-[#F3F4F4] px-6 py-2 rounded-lg border-[#141413] border-b-4 hover:bg-[#262624] active:brightness-90" onClick={() => setPage(page - 1)} disabled={page === 1}>{`<`}</button>

                    <span className="bg-[#F3F4F4] text-black px-6 py-2 rounded-lg border-[#F8F3E1] border-b-4">{page}page</span>

                    <button className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all bg-[#141413] text-[#F3F4F4] px-6 py-2 rounded-lg border-[#141413] border-b-4 hover:bg-[#262624] active:brightness-90" onClick={() => setPage(page + 1)}>{`>`}</button>
                </div>

                <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </>
    );
}