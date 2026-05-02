import { useParams } from 'react-router-dom';
import { useMovieDetail } from '../../hooks/useMovieDetail';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import Error from '../../components/error/Error';
import Up from '../../components/movie/detail/Up';
import Down from '../../components/movie/detail/Down';

const DetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { movie, credits, loading, error } = useMovieDetail(movieId || '');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie || !credits) {
    return <Error message={error || '영화 정보를 불러올 수 없습니다.'} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full bg-black">
      <Up movie={movie} />
      <Down credits={credits} />
    </div>
  );
};

export default DetailPage;
