import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import useGetLpDetail from "../hooks/querys/useGetLpDetail";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export default function LpDetailPage() {
  const { lpid } = useParams(); 
  const id = Number(lpid);
  const nav = useNavigate();
  const loc = useLocation();

  const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const token = getItem();

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다.");
      nav(`/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`, {
        replace: true,
      });
    }
  }, [token, nav, loc]);

  const { data, isPending, isError, refetch } = useGetLpDetail(id);

  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-8 flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl bg-neutral-900 p-6 animate-pulse">
          <div className="h-6 w-40 bg-neutral-800 rounded mb-3" />
          <div className="h-4 w-24 bg-neutral-800 rounded mb-6" />
          <div className="aspect-square w-full bg-neutral-800 rounded-xl mb-6" />
          <div className="h-4 w-5/6 bg-neutral-800 rounded mb-2" />
          <div className="h-4 w-2/3 bg-neutral-800 rounded mb-2" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-8 flex justify-center">
        <div className="w-full max-w-3xl text-neutral-300">
          불러오기 실패.{" "}
          <button onClick={() => refetch()} className="underline">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const lp = data.data;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 flex justify-center">
      <article className="w-full max-w-3xl rounded-2xl bg-neutral-900 p-6 shadow-lg">
 <header className="flex flex-col gap-2">
  <div className="flex items-center justify-between">
    <div className="text-sm text-neutral-300">작성자 #{lp.authorId}</div>
    <div className="text-sm text-neutral-400">{fmt(lp.createdAt)}</div>
  </div>

  <div className="flex items-center justify-between">
    <div className="mt-1 text-2xl font-semibold">{lp.title}</div>
    <div className="flex items-center pt-2 gap-1">
      <Link
        to={`/lp/${lp.id}/edit`}
        className="rounded-md bg-neutral-800 px-1 py-1 text-sm hover:bg-neutral-700"
      >
        <img className="w-7" src="../public/images/mod.png" alt="수정 이미지" />
      </Link>
      <button
        className="rounded-md bg-neutral-800 px-1 py-1 text-sm hover:bg-neutral-700"
        onClick={() => {
          if (!confirm("삭제할래?")) return;
        }}
      >
        <img className="w-7" src="../public/images/gar.png" alt="삭제 이미지" />
      </button>
    </div>
  </div>
</header>

<div className="mt-6 flex justify-center">
  <div className="rounded-xl border border-neutral-700 bg-neutral-900 
                  shadow-[0_12px_32px_rgba(0,0,0,0.45)] p-6">
    <div className="relative w-[320px] h-[320px] rounded-full overflow-hidden 
                    ring-1 ring-black/60 bg-black">
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover rounded-full"
      />
      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full 
                      -translate-x-1/2 -translate-y-1/2 shadow-inner" />
    </div>
  </div>
</div>




        <section className="mt-6 leading-relaxed text-neutral-200 whitespace-pre-wrap">
          {lp.content}
        </section>

        {lp.tags?.length > 0 && (
          <section className="mt-6 flex flex-wrap gap-2">
            {lp.tags.map((t) => (
              <span
                key={t.id}
                className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300"
              >
                #{t.name}
              </span>
            ))}
          </section>
        )}

        <footer className="mt-8 flex items-center justify-between">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-700"
            onClick={() => {
            }}
          >
            <span>❤️</span>
            <span>{lp.likes?.length ?? 0}</span>
          </button>
    <button
      onClick={() => nav(`/lp/${lpid}/comments`)}
      aria-label="댓글로 이동"
      className="fixed bottom-24 right-8 z-40 h-12 w-12 rounded-full bg-neutral-800 text-white
                 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-neutral-700 transition flex items-center justify-center"
    >
댓글
    </button>


        </footer>
      </article>
    </div>
  );
}
