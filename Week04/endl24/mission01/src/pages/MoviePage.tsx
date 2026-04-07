import { useState } from "react";
import { type MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../hooks/useFetch";
import { ErrorView } from "../components/ErrorView";

export default function MoviePage() {
  const [page, setPage] = useState(1);

  const { category } = useParams<{
    category: string;
  }>();

  const apiKey = import.meta.env.VITE_TMDB_KEY;
  const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=ko-KR&page=${page}`;

  const { data, isPending, isError, errorMsg } = useFetch<MovieResponse>(url);

  const movies = data?.results || [];

  if (isError) {
    return (
      <div>
        {" "}
        <ErrorView
          message={errorMsg}
          onRetry={() => window.location.reload()}
        />
        ;
      </div>
    );
  }
  return (
    <>
      <Pagination page={page} setPage={setPage} />
      {isPending ? (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          {!isPending && (
            <div className="grid p-10 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
