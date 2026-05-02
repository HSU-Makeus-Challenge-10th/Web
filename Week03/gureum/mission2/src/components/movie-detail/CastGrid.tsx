import type { CastMember } from '../../types/movie';

interface CastGridProps {
  cast: CastMember[];
}

const CastGrid = ({ cast }: CastGridProps) => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">주요 출연진</h2>

      {cast.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cast.map((actor) => (
            <div key={actor.id} className="text-center group">
              <div className="relative overflow-hidden rounded-lg mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                      : '/api/placeholder/150/225'
                  }
                  alt={actor.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {actor.name}
              </h3>
              <p className="text-sm text-gray-600">{actor.character}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">출연진 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default CastGrid;
