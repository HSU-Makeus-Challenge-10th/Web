import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  // URL에서 :movieId 파라미터를 뽑아옵니다.
  const { movieId } = useParams();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-extrabold text-zinc-800">🎬 영화 상세 페이지</h1>
      <p className="text-xl font-bold text-violet-600">선택된 영화 ID: {movieId}</p>
      <p className="text-zinc-500">이곳에 향후 영화 상세 정보가 렌더링됩니다.</p>
    </div>
  );
}