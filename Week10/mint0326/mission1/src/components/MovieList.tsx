import React, { memo } from 'react';
import type { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieList = memo(({ movies, onMovieClick }: MovieListProps) => {
  console.log("MovieList 리렌더링됨");

  if (movies.length === 0) {
    return <div className="no-movies">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
});

export default MovieList;
