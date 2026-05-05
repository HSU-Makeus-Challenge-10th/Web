import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useComments, useCreateComment } from "../hooks/querys/useComments";
import { useAuth } from "../context/AuthContext";

const fmt = (s: string) =>
  new Date(s).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function CommentsPage() {
  const { lpid } = useParams();
  const lpId = Number(lpid);
  const { accessToken } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [order, setOrder] = useState<"asc" | "desc">("desc"); 
  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useComments(lpId, { order, limit: 20 });

  const { mutateAsync: create } = useCreateComment(lpId);
  const [text, setText] = useState("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: "300px" });
    io.observe(node);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flatMap((p) => p.data.data) ?? [];

  const requireLogin = () => {
    if (!accessToken) {
      alert("로그인이 필요하다.");
      nav(`/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`, { replace: true });
      return true;
    }
    return false;
  };

  const submit = async () => {
    if (!text.trim()) return;
    if (requireLogin()) return;
    await create(text.trim());
    setText("");
  };

  return (
    <div className="flex justify-center pt-10 px-4">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">댓글</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setOrder("asc")}
              className={`px-3 py-1 text-sm rounded ${order === "asc" ? "bg-white text-black" : "bg-neutral-800 hover:bg-neutral-700"}`}
            >
              오래된순
            </button>
            <button
              onClick={() => setOrder("desc")}
              className={`px-3 py-1 text-sm rounded ${order === "desc" ? "bg-white text-black" : "bg-neutral-800 hover:bg-neutral-700"}`}
            >
              최신순
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={requireLogin}
            placeholder="댓글을 입력해주세요"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:border-neutral-400 outline-none"
          />
          <button
            onClick={submit}
            className="px-4 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm"
          >
            작성
          </button>
        </div>

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 w-2/3 bg-neutral-800 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-neutral-400 text-sm">댓글 조회 실패</div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  {c.author?.avatar ? (
                    <img
                      src={c.author.avatar}
                      alt={c.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs">
                      {c.author?.name?.[0] ?? "?"}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{c.author?.name ?? `#${c.authorId}`}</span>
                      <span className="text-xs text-neutral-400">{fmt(c.createdAt)}</span>
                    </div>
                    <div className="text-sm text-neutral-200 whitespace-pre-wrap">{c.content}</div>
                  </div>

                  <button className="text-neutral-400 hover:text-white">⋮</button>
                </li>
              ))}
            </ul>

            <div ref={sentinelRef} className="h-8" />
            {isFetchingNextPage && (
              <div className="text-center text-neutral-500 text-sm py-3">불러오는 중…</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
