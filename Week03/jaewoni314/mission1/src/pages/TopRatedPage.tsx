import MovieGrid from '../components/MovieGrid';
import { useTopRatedMovies } from '../hooks/useMovieCategories';

const TopRatedPage = () => {
  const { movies, loading, error } = useTopRatedMovies();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default TopRatedPage;
