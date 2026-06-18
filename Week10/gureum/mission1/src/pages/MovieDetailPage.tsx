import { useParams } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CastGrid from '../components/movie-detail/CastGrid';
import MovieHero from '../components/movie-detail/MovieHero';
import MovieMetaCards from '../components/movie-detail/MovieMetaCards';
import { useMovieDetail } from '../hooks/useMovieDetail';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  // 상세 페이지도 목록 페이지와 같은 규칙으로 refetch를 사용합니다.
  // 그래서 에러가 나도 홈으로 튕기지 않고, 현재 상세 요청만 다시 시도할 수 있습니다.
  const { movie, director, mainCast, isLoading, error, refetch } = useMovieDetail(movieId);

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
        actionLabel="다시 시도"
        // 기존 "홈으로 이동" 대신, 실패한 요청 자체를 재실행합니다.
        onAction={() => {
          void refetch();
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