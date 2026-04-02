import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { CreditsResponse, MovieDetails } from '../types/movie';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchDetails = async () => {
      const accessToken = import.meta.env.VITE_TMDB_KEY;

      if (!accessToken) {
        setError('VITE_TMDB_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [detailRes, creditsRes] = await Promise.all([
          axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { language: 'ko-KR' },
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              params: { language: 'ko-KR' },
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          ),
        ]);

        setMovie(detailRes.data);
        setCredits(creditsRes.data);
      } catch (fetchError) {
        console.error('영화 상세 불러오기 실패:', fetchError);
        setError('에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-red-400">{error ?? '영화 정보를 불러오지 못했습니다.'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-50 hover:bg-zinc-700"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : undefined;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const mainCast = credits?.cast.slice(0, 14) ?? [];

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-zinc-900">
        <div className="relative h-[260px] w-full sm:h-[320px]">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={movie.title}
              className="h-full w-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="absolute inset-0 flex items-end px-8 pb-8">
            <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:gap-6">
              <img
                src={posterUrl}
                alt={movie.title}
                className="hidden h-40 w-28 rounded-2xl object-cover shadow-lg sm:block"
              />
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{movie.title}</h1>
                <p className="mt-1 text-sm text-zinc-300">
                  평점 {movie.vote_average.toFixed(1)} •
                  {' '}
                  {movie.release_date ? movie.release_date.slice(0, 4) : '연도 미정'} •
                  {' '}
                  {movie.runtime ? `${movie.runtime}분` : '러닝타임 정보 없음'}
                </p>
                <p className="mt-3 max-w-2xl text-sm text-zinc-200 line-clamp-4">
                  {movie.overview || '줄거리 정보가 제공되지 않습니다.'}
                </p>
                {movie.genres.length > 0 && (
                  <p className="mt-3 text-xs text-violet-300">
                    장르:{' '}
                    {movie.genres.map((g) => g.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">감독/출연</h2>
        {mainCast.length === 0 ? (
          <p className="text-sm text-zinc-400">출연진 정보가 없습니다.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {mainCast.map((cast) => {
              const profileUrl = cast.profile_path
                ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
                : 'https://via.placeholder.com/120x120?text=No+Image';

              return (
                <div
                  key={cast.id}
                  className="flex w-28 shrink-0 flex-col items-center gap-2 rounded-2xl bg-zinc-900/70 px-3 py-3 text-center"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-700">
                    <img
                      src={profileUrl}
                      alt={cast.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="line-clamp-1 text-[11px] font-semibold text-zinc-50">
                    {cast.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-zinc-400">{cast.character}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">비슷한 인기 영화</h2>
        <p className="text-sm text-zinc-400">(추가 기능으로 구현해도 좋습니다 😊)</p>
      </section>
    </section>
  );
}
