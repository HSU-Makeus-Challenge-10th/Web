import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import MovieFilter from "../components/MovieFilter";
import type { MovieFilters, MovieResponse } from "../types/movie";
import { useState } from "react";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", {
    params: filters, 
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <MovieFilter onChange={setFilters} />
      
      {isLoading ? (
        <div>로딩 중 입니다...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  );
}