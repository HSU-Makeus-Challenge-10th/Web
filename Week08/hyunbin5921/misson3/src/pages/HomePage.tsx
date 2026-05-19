import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { LpCard } from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import { useSearch } from "../context/SearchContext";
import type { PaginationDto } from "../types/common";
import useThrottle from "../hooks/useThrottle";

const HomePages = () => {
  const { debouncedSearch } = useSearch();
  const [order, setOrder] = useState<PaginationDto["order"]>("asc");

  // 🔹 스크롤 위치 상태
  const [scrollY, setScrollY] = useState(0);

  // 🔹 스크롤 위치를 throttle
  const throttledScrollY = useThrottle(scrollY, 3000); // 300ms마다 한 번만 반영

const {
  data: lps,
  isFetching,
  hasNextPage,
  isPending,
  fetchNextPage,
  isError,
} = useGetInfiniteLpList(10, debouncedSearch, order ?? "desc");

useEffect(() => {
    let lastWheel = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();

      // 3초 이내 반복 휠 → 스크롤 막기
      if (now - lastWheel < 3000) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // 3초 지났으면 스크롤 허용
      lastWheel = now;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 🔹 실제 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 움직일 때마다 값은 막 바뀌게 둠
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 throttledScrollY가 바뀔 때만 “밑에 거의 다 왔는지” 체크해서 fetchNextPage
useEffect(() => {
  if (!hasNextPage || isFetching) return;

  const { innerHeight } = window;
  const { offsetHeight } = document.body;

  // 여기서 실제로 throttledScrollY를 써야 체감이 남
  const isNearBottom =
    innerHeight + throttledScrollY >= offsetHeight - 300;

  if (isNearBottom) {
    fetchNextPage();
  }
}, [throttledScrollY, hasNextPage, isFetching, fetchNextPage]);
  if (isPending) return <div className="mt-20">Loading..</div>;
  if (isError) return <div className="mt-20">Error..</div>;

  return (
    <div className="container mx-auto px-20 py-6">
      {/* 🔻 정렬 버튼 다시 추가된 부분 */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setOrder("desc")}
            className={`px-3 py-1 rounded-full border transition-colors
              ${
                order === "desc"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "border-gray-500 text-gray-300 hover:border-pink-400 hover:text-pink-400"
              }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setOrder("asc")}
            className={`px-3 py-1 rounded-full border transition-colors
              ${
                order === "asc"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "border-gray-500 text-gray-300 hover:border-pink-400 hover:text-pink-400"
              }`}
          >
            오래된순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-5">
        {lps?.pages
          ?.flatMap((page) => page.data.data)
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}

        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
    </div>
  );
};

export default HomePages;
