import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            {/*이미지 안나올 때 대비 alt 속성 추가*/}
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full transition-all duration-300 group-hover:blur-sm"
            />
            {/* hover 시 나타나는 내용 */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center text-white">
                <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                <p className="text-sm line-clamp-4">{movie.overview}</p>
            </div>
        </div>
    )
}