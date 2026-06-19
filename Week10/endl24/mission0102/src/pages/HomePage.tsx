import { useState, useCallback } from "react"; 
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import useFetch from "../hooks/useFetch";
import { Modal } from "../components/Modal";
import type { MovieFilters, MovieResponse, Movie } from "../types/movie";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "",
    include_adult: false,
    language: "ko-KR",
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const endpoint = filters.query ? "/search/movie" : "/discover/movie";
  
  const { data, error, isLoading } = useFetch<MovieResponse>(endpoint, {
    params: {
      query: filters.query || undefined,
      include_adult: filters.include_adult,
      language: filters.language,
    },
  });

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie); 
    setIsModalOpen(true);    
  }, []); 

  if (error) {
    return <div className="p-8 text-center font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto min-h-screen p-4 sm:p-8 relative">
      <MovieFilter onChange={setFilters} />

      <div className="mt-8">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center font-bold text-zinc-400">
            영화를 불러오는 중입니다... 🍿
          </div>
        ) : (
          <MovieList
            movies={data?.results || []}
            onMovieClick={handleMovieClick} 
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedMovie && (
          <div className="flex flex-col">
            <div className="relative h-64 w-full bg-zinc-100">
              <img
                src={
                  selectedMovie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
                    : selectedMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                      : "https://via.placeholder.com/500x300?text=No+Image"
                }
                alt={selectedMovie.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 p-6">
              <h3 className="text-2xl font-extrabold text-zinc-800">
                {selectedMovie.title}
              </h3>

              <div className="flex items-center gap-3 text-sm font-bold text-zinc-500">
                <span>⭐ 평점: {selectedMovie.vote_average?.toFixed(1)}</span>
                <span>|</span>
                <span>📅 개봉일: {selectedMovie.release_date}</span>
              </div>

              <p className="mt-1 max-h-32 overflow-y-auto text-sm font-medium leading-relaxed text-zinc-600 scrollbar-hide">
                {selectedMovie.overview || "등록된 줄거리가 없습니다."}
              </p>

              <div className="mt-4 flex justify-end gap-3">
                <a
                  href={`https://www.imdb.com/find?q=${encodeURIComponent(selectedMovie.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl bg-[#f5c518] px-5 py-2.5 text-sm font-extrabold text-black transition-all hover:bg-[#e2b616]"
                >
                  IMDb에서 검색하기
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-200"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
