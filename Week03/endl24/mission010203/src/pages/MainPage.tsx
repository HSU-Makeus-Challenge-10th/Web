import { useEffect, useState } from "react";
import axios from "axios";
import type { MovieDetail, MovieResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function MainPage() {
  const [heroMovie, setHeroMovie] = useState<MovieDetail | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      setIsPending(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_KEY;
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`;
        const { data } = await axios.get<MovieResponse>(url);
        if (!data.results?.length) {
          throw new Error("No movies available");
        }
        const firstMovieId = data.results[0].id;

        const detailUrl = `https://api.themoviedb.org/3/movie/${firstMovieId}?api_key=${apiKey}&language=ko-KR`;
        const { data: movieDetail } = await axios.get<MovieDetail>(detailUrl);

        setHeroMovie(movieDetail);
      } catch (error) {
        console.error("히어로 영화 로딩 실패:", error);
      } finally {
        setIsPending(false);
      }
    };

    fetchHeroMovie();
  }, []);

  if (isPending || !heroMovie) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] bg-black text-white overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
        alt={heroMovie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col justify-center h-full max-w-2xl px-12 gap-5">
        <h1 className="text-6xl font-bold leading-tight drop-shadow-lg">
          {heroMovie.title}
        </h1>

        {heroMovie.tagline && (
          <p className="text-2xl italic text-gray-300">"{heroMovie.tagline}"</p>
        )}

        <div className="flex items-center gap-3 text-lg font-medium">
          <span className="text-yellow-400">
            ⭐ {heroMovie.vote_average.toFixed(1)}
          </span>
          <span>|</span>
          <span>{heroMovie.release_date.substring(0, 4)}</span>
          <span>|</span>
          <span>{heroMovie.runtime}분</span>
        </div>

        <p className="text-lg leading-relaxed text-gray-200 line-clamp-3 max-w-xl">
          {heroMovie.overview || "등록된 줄거리가 없습니다."}
        </p>

        <div className="mt-5">
          <Link
            to={`/movie/${heroMovie.id}`}
            className="bg-white text-black px-8 py-3 rounded-lg font-bold text-lg 
                       hover:bg-gray-300 transition-all duration-200 shadow-lg"
          >
            ▶ 상세보기
          </Link>
        </div>
      </div>
    </div>
  );
}
