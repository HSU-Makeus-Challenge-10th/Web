import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

type Genre = { id: number; name: string }
type Cast = { id: number; name: string; character: string; profile_path: string | null; order: number }
type Crew = { id: number; name: string; job: string }
type MovieDetails = {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null
  vote_average: number
  genres: Genre[]
}
type Credits = { id: number; cast: Cast[]; crew: Crew[] }

const TMDB_BASE = "https://api.themoviedb.org/3"
const TMDB_HDRS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`, 
  accept: "application/json",
}
const img = (p: string | null, size: "w200" | "w300" | "w500" | "original" = "w500") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : ""

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const id = Number(movieId)

  const [details, setDetails] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("잘못된 영화 ID")
      setLoading(false)
      return
    }
    window.scrollTo(0, 0)
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [d, c] = await Promise.all([
          axios.get<MovieDetails>(`${TMDB_BASE}/movie/${id}`, { params: { language: "ko-KR" }, headers: TMDB_HDRS }),
          axios.get<Credits>(`${TMDB_BASE}/movie/${id}/credits`, { params: { language: "ko-KR" }, headers: TMDB_HDRS }),
        ])
        if (!alive) return
        setDetails(d.data)
        setCredits(c.data)
      } catch (e: any) {
        if (!alive) return
        setError(e?.response?.data?.status_message || e?.message || "불러오기 실패")
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [id])

  const director = useMemo(() => credits?.crew.find((p) => p.job === "Director") || null, [credits])
  const topCast = useMemo(() => (credits?.cast ?? []).sort((a, b) => a.order - b.order).slice(0, 12), [credits])

  if (loading) return <div className="min-h-screen bg-black text-white p-10 text-center">로딩 중…</div>
  if (error || !details)
    return (
      <div className="min-h-screen bg-black text-white p-10 text-center">
        <p className="text-red-400 text-xl">에러</p>
        <p className="text-white/70 mt-2">{error}</p>
        <Link className="underline mt-4 inline-block" to="/">홈으로</Link>
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      <section className="relative overflow-hidden rounded-2xl">
        {details.backdrop_path && (
          <img
            src={img(details.backdrop_path, "original")}
            alt="backdrop"
            className="w-full max-h-[480px] object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-10">
            <h1 className="text-3xl md:text-5xl font-extrabold">{details.title}</h1>
            <div className="mt-3 text-white/80">
              <span>{details.release_date?.slice(0, 4) || "N/A"}</span>
              <span className="mx-2">•</span>
              <span>{details.runtime ? `${details.runtime}분` : "미정"}</span>
              <span className="mx-2">•</span>
              <span>{details.genres.map((g) => g.name).join(", ") || "장르 없음"}</span>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-2 bg-yellow-300/20 text-yellow-300 px-3 py-1 rounded-lg">
                <span>⭐</span>
                <span className="font-semibold">{details.vote_average.toFixed(1)}</span>
              </span>
              {director && <span className="ml-4 text-white/70">감독: {director.name}</span>}
            </div>
            <p className="mt-4 max-w-4xl leading-7 text-white/90">
              {details.overview || "설명 없음"}
            </p>
          </div>
        </div>
      </section>


<section className="mt-10">
  <h2 className="text-xl font-semibold mb-4">감독/출연</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
    {topCast.map((c) => (
      <div key={c.id} className="text-center">
        <div className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-white/20 bg-neutral-900">
          {c.profile_path ? (
            <img
              src={img(c.profile_path, "w200")}
              alt={c.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800" />
          )}
        </div>
        <p className="mt-3 font-semibold truncate">{c.name}</p>
        <p className="text-sm text-white/60 truncate">{c.character}</p>
      </div>
    ))}
  </div>
</section>

      <div className="mt-10">
        <Link to={-1 as any} className="underline text-white/80 hover:text-white">뒤로</Link>
      </div>
    </div>
  )
}