import { useEffect, useState } from "react"
import axios from "axios"
import type { Movie } from "../types/movie"
import MovieCard from "../components/MovieCard"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useParams } from "react-router-dom"

export default function MoviePage() {
  const TMDB_BASE = "https://api.themoviedb.org/3"
  const TMDB_HDRS = {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`, 
    accept: "application/json",
  }

  const { category } = useParams<{ category: string }>()
  const VALID = new Set(["popular", "now_playing", "top_rated", "upcoming"])
  const cat = VALID.has(category ?? "") ? (category as string) : "popular"

  const [movies, setMovies] = useState<Movie[]>([])
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let alive = true
    const fetchMovie = async () => {
      setIsPending(true)
      setIsError(null)
      try {
        const { data } = await axios.get<{ results: Movie[] }>(`${TMDB_BASE}/movie/${cat}`, {
          params: { language: "ko-KR", page },
          headers: TMDB_HDRS,
        })
        if (!alive) return
        setMovies(data.results ?? [])
      } catch (e: any) {
        if (!alive) return
        const msg = e?.response?.data?.status_message || e?.message || "불러오기 실패"
        setIsError(msg)
      } finally {
        if (alive) setIsPending(false)
      }
    }
    fetchMovie()
    return () => {
      alive = false
    }
  }, [cat, page])

  if (isError) {
    return (
      <div className="p-6 text-center">
        <span className="text-red-500 text-2xl">에러 발생</span>
        <p className="mt-2 text-gray-500">{isError}</p>
        <button className="mt-4 bg-black text-white px-4 py-2 rounded" onClick={() => setPage((p) => p)}>
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                     hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
                     cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                     hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  )
}