import MovieGrid from '../components/MovieGrid';
import { useNowPlayingMovies } from '../hooks/useMovieCategories';

const NowPlayingPage = () => {
  const { movies, loading, error } = useNowPlayingMovies();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default NowPlayingPage;
