import MovieGrid from './MovieGrid';
import LoadingSpinner from '../spinner/LoadingSpinner';
import Error from '../error/Error';
import Pagination from '../pagination/Pagination';
import {
  useMovieCategories,
  type MovieCategory,
} from '../../hooks/useMovieCategories';

interface MovieListProps {
  category: MovieCategory;
}

const MovieList = ({ category }: MovieListProps) => {
  const { movies, loading, error, currentPage, totalPages, onChangePage } =
    useMovieCategories(category);

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error} />;

  return (
    <div className="container mx-auto px-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={onChangePage}
      />
      <MovieGrid movies={movies} />
    </div>
  );
};

export default MovieList;
