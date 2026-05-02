import { useParams } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CastGrid from '../components/movie-detail/CastGrid';
import MovieHero from '../components/movie-detail/MovieHero';
import MovieMetaCards from '../components/movie-detail/MovieMetaCards';
import { useMovieDetail } from '../hooks/useMovieDetail';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { movie, director, mainCast, isLoading, error } = useMovieDetail(movieId);

  // 로딩 상태
  if (isLoading) {
    return <LoadingSpinner message="영화 정보를 불러오는 중..." size="lg" />;
  }

  // 에러 상태
  if (error || !movie) {
    return (
      <ErrorState
        icon="😅"
        message={error || '영화를 찾을 수 없습니다.'}
        actionLabel="홈으로 돌아가기"
        onAction={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MovieHero movie={movie} director={director} />
      <CastGrid cast={mainCast} />
      <MovieMetaCards movie={movie} />
    </div>
  );
};

export default MovieDetailPage;