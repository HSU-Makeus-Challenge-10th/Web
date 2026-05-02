import type { Movie } from '../../../types/movies';

interface UpProps {
  movie: Movie;
}

const Up = ({ movie }: UpProps) => {
  const releaseYear = movie.release_date?.slice(0, 4);
  const backgroundUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

  return (
    <div
      className="relative w-[95%] h-[30vw] bg-cover bg-center mt-[2vw] overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
      }}
    >
      <div className="relative flex items-center justify-center h-full px-8 bg-black/60">
        <div className="max-w-4xl w-full ">
          <div className="w-1/2 h-full absolute top-0 left-0 border-b-[0.2vw] border-b-white text-white p-[2vw]">
            <p className="text-[2vw] font-bold">{movie.title}</p>
            <p className="text-[1vw] mt-[1vw]">
              평균: {movie.vote_average.toFixed(1)}
              <br />
              {releaseYear}
              <br />
              {movie.runtime}분
            </p>
            <p className="italic text-[1.5vw] mt-[2vw]">{movie.tagline}</p>
            <br />
            <p className="text-[1vw]">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Up;
