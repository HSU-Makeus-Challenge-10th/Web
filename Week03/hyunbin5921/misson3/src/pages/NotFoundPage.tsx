import { Link, useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()
  const err = useRouteError()

  const status = isRouteErrorResponse(err) ? err.status : 404
  const message =
    isRouteErrorResponse(err)
      ? err.statusText || "페이지를 찾을 수 없음"
      : "요청하신 페이지가 없거나 이동할 수 없다."

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <p className="text-sm text-white/60">Error</p>
      <h1 className="mt-1 text-6xl font-extrabold">{status}</h1>
      <p className="mt-3 text-white/80 text-center">{message}</p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded border border-white/20 hover:bg-white/10 transition"
        >
          뒤로가기
        </button>
        <Link
          to="/"
          className="px-4 py-2 rounded bg-white text-black font-semibold hover:opacity-90 transition"
        >
          홈으로
        </Link>
      </div>
    </div>
  )
}