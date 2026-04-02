import type { Movie } from '../types/movies';

interface MovieItemProps {
  movie: Movie;
}
const MovieItem = ({ movie }: MovieItemProps) => {
  return (
    <div
      onClick={() => {}}
      className="relative overflow-hidden rounded-xl cursor-pointer"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 backdrop-blur-md flex flex-col justify-center align-items items-center p-4 opacity-0 hover:opacity-100 ">
        <p className="text-white font-bold text-sm mb-1">{movie.title}</p>
        <p className="text-white text-xs line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieItem;
