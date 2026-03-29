import axios from "axios";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import type { Movie, MovieResponse } from "../types/movie";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const { data } = await axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/popular`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
            })
            setMovies(data.results);
        }
        fetchMovies();
    }, []);

    console.log(movies);
    return (
        <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}