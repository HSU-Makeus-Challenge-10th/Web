import { useState } from "react"; 
import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    
    return (
        <div
            
            onClick={() => navigate(`/movies/details/${movie.id}`)}
            className='relative rounded-xl shadow-sm overflow-hidden cursor-pointer w-44 transition-transform duration-500 hover:scale-104'
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
        >
            <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={`${movie.title} 영화의 이미지`}
                className=''
            />

            {isHovered && (
                
                <div className='absolute inset-0  from-black/65
                backdrop-blur-sm backdrop-brightness-70 flex flex-col justify-center
                items-center text-white p-4 text-center'> 
                   
                    <h2 className='text-lg font-Pretendard text-center leading-snug'>{movie.title}</h2>
                    <p className='text-sm text-gray-100 leading-relaxed mt-2 line-clamp-4'>{movie.overview}</p>
                    
                </div> 
                
            )}
        </div>
    );
}