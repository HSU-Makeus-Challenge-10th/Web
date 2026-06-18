import type { MovieDetail } from '../../types/movie';

interface MovieMetaCardsProps {
  movie: MovieDetail;
}

const MovieMetaCards = ({ movie }: MovieMetaCardsProps) => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">상세 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">기본 정보</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">원제:</span> {movie.original_title}
              </p>
              <p>
                <span className="font-medium">상태:</span> {movie.status}
              </p>
              <p>
                <span className="font-medium">언어:</span>{' '}
                {movie.original_language.toUpperCase()}
              </p>
              <p>
                <span className="font-medium">인기도:</span> {movie.popularity.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">박스오피스</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">제작비:</span>{' '}
                {movie.budget ? `$${movie.budget.toLocaleString()}` : '정보 없음'}
              </p>
              <p>
                <span className="font-medium">수익:</span>{' '}
                {movie.revenue ? `$${movie.revenue.toLocaleString()}` : '정보 없음'}
              </p>
            </div>
          </div>

          {movie.homepage && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">링크</h3>
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                공식 웹사이트 →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieMetaCards;
