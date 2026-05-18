import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard";
import { LpListSkeleton } from "../components/LpSkeleton";
import ErrorRetry from "../components/ErrorRetry";
import { PAGINATION_ORDER } from "../enums/common";
import { ArrowUpDown } from "lucide-react";


const HomePage = () => {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
  const [search] = useState("");


  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useGetInfiniteLpList(10, search, sort);


  const { ref, inView } = useInView({
    threshold: 0,
  });

  // 3. 무한 스크롤 트리거 로직
  useEffect(() => {

    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetching]);

  const toggleSort = () => {
    setSort((prev) => (prev === PAGINATION_ORDER.DESC ? PAGINATION_ORDER.ASC : PAGINATION_ORDER.DESC));
  };


  const allLps = data?.pages.flatMap((page) => page.data?.data || []) || [];

  if (isPending) {
    return (
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-32 animate-pulse" />
        </header>
        <LpListSkeleton />
      </div>
    );
  }

  if (isError) {
    return <ErrorRetry onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            전체 LP 목록
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            다양한 사연이 담긴 LP를 만나보세요.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSort}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{sort === PAGINATION_ORDER.DESC ? "최신순" : "오래된순"}</span>
          </button>
        </div>
      </header>

      {/* 목록 영역 */}
      {allLps.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allLps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>


          <div ref={ref} className="mt-8">
            {isFetchingNextPage && <LpListSkeleton />}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            등록된 LP가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
