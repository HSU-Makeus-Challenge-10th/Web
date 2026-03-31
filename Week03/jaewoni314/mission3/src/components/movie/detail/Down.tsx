import { User } from 'lucide-react';
import type { Credit } from '../../../types/credit';

interface DownProps {
  credits: Credit;
}

const Down = ({ credits }: DownProps) => {
  return (
    <div className="py-8 px-8">
      <div className="w-full mx-auto">
        <h2 className="text-white text-3xl font-bold mb-8 ml-4">감독/출연</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-6">
          {credits.cast.map((actor) => {
            const imageUrl = actor.profile_path
              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
              : null;

            return (
              <div key={actor.id} className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={actor.name ?? '이름 정보 없음'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-500 w-10 h-10" />
                  )}
                </div>
                <p className="text-white text-sm font-medium mb-1">
                  {actor.name || '이름 정보 없음'}
                </p>
                <p className="text-gray-400 text-xs">
                  {actor.character || '배역 정보 없음'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Down;
