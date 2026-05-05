// src/pages/Homepage.tsx  (무한스크롤 B버전)
import { useEffect, useRef, useState } from "react";
import useGetLpListInfinite from "../hooks/querys/useGetLpListInfinite";
import LpCard from "../components/LpCard";

export default function Homepage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const limit = 25; // 5 x 5 로딩 스켈레톤 맞춤

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetLpListInfinite({ order, limit });

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "300px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flatMap((p) => p.data.data) ?? [];

  return (
    <div className="pt-4">
      {/* 정렬 토글 */}
      <div className="px-10 py-5 flex justify-end gap-2">
        <button
          onClick={() => setOrder("asc")}
          className={`px-3 py-1 rounded ${order === "asc" ? "bg-white text-black" : "bg-neutral-800"}`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          className={`px-3 py-1 rounded ${order === "desc" ? "bg-white text-black" : "bg-neutral-800"}`}
        >
          최신순
        </button>
      </div>

      {/* 그리드: max 5열 */}
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-neutral-300">불러오기 실패.</div>
      ) : (
        <>
          <div className="pr-20 pl-40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
            {items.map((lp: any) => (
              <LpCard
                key={lp.id}
                id={lp.id}
                title={lp.title}
                thumbnail={lp.thumbnail}
                createdAt={lp.createdAt}
                likesCount={lp.likes?.length ?? 0}
              />
            ))}
          </div>

          {/* 무한스크롤 센티넬 */}
          <div ref={sentinelRef} className="h-12" />

          {isFetchingNextPage && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-neutral-900 animate-pulse" />
              ))}
            </div>
          )}

          {!hasNextPage && (
            <div className="py-6 text-center text-sm text-neutral-500">끝</div>
          )}
        </>
      )}
    </div>
  );
}
