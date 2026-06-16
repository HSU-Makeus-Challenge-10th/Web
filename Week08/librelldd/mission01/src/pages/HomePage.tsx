import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useDebounce from "../hooks/useDebounce";
import LpCard from "../components/LpCard";
import { LpListSkeleton } from "../components/LpSkeleton";
import ErrorRetry from "../components/ErrorRetry";
import { PAGINATION_ORDER } from "../enums/common";
import { ArrowUpDown, Search, X } from "lucide-react";
import useThrottle from "../hooks/useThrottle";

const HomePage = () => {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
  const [text, setText] = useState("");
  const [searchType, setSearchType] = useState<"title" | "tag">("title");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);


  const debouncedQuery = useDebounce(text, 300);


  useEffect(() => {
    if (debouncedQuery.trim() && !recentSearches.includes(debouncedQuery.trim())) {
      setRecentSearches(prev => [debouncedQuery.trim(), ...prev.slice(0, 4)]);
    }
  }, [debouncedQuery]);

  // 무한 스크롤 데이터 페칭
  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useGetInfiniteLpList(10, debouncedQuery, sort);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const throttledInView = useThrottle(inView, 300);

  useEffect(() => {
    if (throttledInView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [throttledInView, hasNextPage, fetchNextPage, isFetching]);

  const toggleSort = () => {
    setSort((prev) => (prev === PAGINATION_ORDER.DESC ? PAGINATION_ORDER.ASC : PAGINATION_ORDER.DESC));
  };

  const clearSearch = () => {
    setText("");
  };

  const removeRecentSearch = (wordToRemove: string) => {
    setRecentSearches(prev => prev.filter(word => word !== wordToRemove));
  };


  const allLps = data?.pages.flatMap((page) => page.data?.data || []) || [];



  if (isError) {
    return <ErrorRetry onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-7 pb-20 pt-24 max-w-7xl mx-auto px-2">

      <div className="w-full max-w-xl mx-auto space-y-2">
        <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-2 shadow-inner">
          <Search className="w-5 h-5 text-gray-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent px-3 py-1 text-gray-900 dark:text-white focus:outline-none"
          />
          {text && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full mr-2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* 제목 */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1.5 bg-purple-100 dark:bg-gray-800 rounded-lg text-sm font-semibold shadow-sm flex items-center space-x-1 border dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <span>{searchType === "title" ? "제목" : "태그"}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-16 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 z-50 overflow-hidden">
                <button
                  onClick={() => { setSearchType("title"); setDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-gray-800/50 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  제목
                </button>
                <button
                  onClick={() => { setSearchType("tag"); setDropdownOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-gray-800/50 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  태그
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 최근 검색어 태그 UI */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold">최근 검색어</span>
            {recentSearches.map((word, idx) => (
              <span
                key={idx}
                className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full cursor-pointer text-xs"
                onClick={() => setText(word)}
              >
                <span>{word}</span>
                <X
                  className="w-3 h-3 hover:text-red-500"
                  onClick={(e) => { e.stopPropagation(); removeRecentSearch(word); }}
                />
              </span>
            ))}
            <button onClick={() => setRecentSearches([])} className="text-xs text-gray-400 hover:text-gray-600 ml-auto">
              모두 지우기
            </button>
          </div>
        )}
      </div>

      {/* 정렬 및 타이틀 헤더 영역 */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t pt-6 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {debouncedQuery ? `"${debouncedQuery}" 검색 결과` : "전체 LP 목록"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {debouncedQuery ? `${allLps.length}개의 LP를 찾았습니다.` : "다양한 사연이 담긴 LP를 만나보세요."}
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
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            {debouncedQuery ? "검색 결과에 맞는 LP가 없습니다." : "등록된 LP가 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;