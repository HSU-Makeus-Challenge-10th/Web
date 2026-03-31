import MovieGrid from '../components/MovieGrid';
import { usePopularMovies } from '../hooks/useMovieCategories';

const MoviesPage = () => {
  const { movies, loading, error } = usePopularMovies();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default MoviesPage;
