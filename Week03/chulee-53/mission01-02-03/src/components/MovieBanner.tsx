import type { Movie } from "../types/movie";

interface MovieBannerProps {
    movie: Movie;
}

export default function MovieBanner({ movie }: MovieBannerProps) {
    return (
        <div className="relative h-[70vh] w-full overflow-hidden">
            {/* 배경 이미지 & 그라데이션 */}
            <div className="absolute inset-0">
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#141413] via-[#141413]/80 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-[#141413] via-transparent to-transparent" />
            </div>

            {/* 영화 상세 정보 */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-[#FFF8F0] tracking-tight">
                    {movie.title}
                </h1>

                <div className="flex items-center gap-4 mb-6 text-lg font-medium text-gray-300">
                    <span className="text-[#FFD700]">★ {movie.vote_average.toFixed(1)}</span>
                    <span>{movie.release_date ? movie.release_date.split("-")[0] : "개봉일 미정"}</span>
                    <span>{movie.runtime ? `${movie.runtime}분` : "상영시간 미정"}</span>
                </div>

                <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-4">
                    {movie.original_title}
                </p>

                <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl">
                    {movie.overview}
                </p>
            </div>
        </div>
    );
}
