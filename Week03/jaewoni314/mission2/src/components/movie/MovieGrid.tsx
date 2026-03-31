import type { Movie } from '../../types/movies.ts';
import MovieItem from './MovieItem.tsx';

const MovieGrid = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {movies?.map((movie) => (
        <MovieItem key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
