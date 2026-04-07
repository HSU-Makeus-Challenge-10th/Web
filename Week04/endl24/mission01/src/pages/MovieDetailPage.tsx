import { useParams } from "react-router-dom";
import type { CreditsResponse, MovieDetail } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { ErrorView } from "../components/ErrorView";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const apiKey = import.meta.env.VITE_TMDB_KEY;
  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`;
  const {
    data: movie,
    isPending: isMoviePending,
    isError: isMovieError,
    errorMsg: movieErrorMsg,
  } = useFetch<MovieDetail>(detailUrl);

  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=ko-KR`;
  const {
    data: credits,
    isPending: isCreditsPending,
    isError: isCreditsError,
    errorMsg: creditsErrorMsg,
  } = useFetch<CreditsResponse>(creditsUrl);

  const isPending = isMoviePending || isCreditsPending;
  const isError = isMovieError || isCreditsError;
  const errorMsg = movieErrorMsg || creditsErrorMsg;

  const cast = credits?.cast.slice(0, 2) || [];
  if (isError) {
    return (
      <ErrorView 
        message={errorMsg} 
        onRetry={() => window.location.reload()} 
      />
    );
  }
  if (isPending || !movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-96 rounded-2xl shadow-2xl object-cover"
        />

        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold">{movie.title}</h1>
          <p className="text-xl italic text-gray-400">"{movie.tagline}"</p>

          <div className="flex items-center gap-4 text-lg">
            <span className="text-yellow-400 font-bold">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span>{movie.release_date}</span>
            <span>{movie.runtime}분</span>
          </div>

          <div className="flex gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-2">줄거리</h3>
            <p className="text-lg leading-relaxed text-gray-300">
              {movie.overview || "등록된 줄거리가 없습니다."}
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">주연 배우</h3>
            <div className="flex gap-6">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-sm">{actor.name}</p>
                    <p className="text-xs text-gray-400">
                      {actor.character} 역
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
