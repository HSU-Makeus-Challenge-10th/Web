import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';
import { getTmdbHeaders } from '../apis/tmdb';


const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await axios.get<MovieResponse>(
                    'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
                    {
                        headers: getTmdbHeaders(),
                    }
                );
                setMovies(data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="bg-black min-h-screen p-8 text-white">
            {/* 그리드 컨테이너: 이 클래스가 있어야 가로로 정렬됩니다 */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="group relative overflow-hidden rounded-lg bg-gray-900">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            className="w-full h-auto transition-transform group-hover:scale-105 group-hover:blur-sm"
                        />
                        {/* 호버 오버레이: group-hover로 부모 호버 시에만 나타나게 함 */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-4 justify-center">
                            <h2 className="font-bold">{movie.title}</h2>
                            <p className="text-xs line-clamp-4">{movie.overview}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoviesPage;