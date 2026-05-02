import MovieGrid from '../components/MovieGrid';
import { useUpcomingMovies } from '../hooks/useMovieCategories';

const UpcomingPage = () => {
  const { movies, loading, error } = useUpcomingMovies();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default UpcomingPage;
