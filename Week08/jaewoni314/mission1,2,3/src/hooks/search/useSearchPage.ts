import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '../useDebounce';
import { useLps } from '../lp/useLps';
import { useLpsByTag } from '../lp/useLpsByTag';
import type { SearchType } from '../../pages/search/components/SearchInput';

export const useSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const shouldFetch = debouncedQuery.trim() !== '';

  const titleSearch = useLps(
    {
      search: debouncedQuery,
      order,
      limit: 10,
    },
    shouldFetch && searchType === 'title'
  );

  const tagSearch = useLpsByTag(
    {
      tagName: debouncedQuery,
      order,
      limit: 10,
    },
    shouldFetch && searchType === 'tag'
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = searchType === 'title' ? titleSearch : tagSearch;

  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setIsDropdownOpen(false);
  };

  const hasData =
    data?.pages &&
    data.pages.length > 0 &&
    data.pages[0]?.data &&
    data.pages[0].data.length > 0;
  const showSkeleton = isLoading || (!hasData && debouncedQuery.trim() !== '');
  const showEmptyState = !isLoading && !hasData && debouncedQuery.trim() !== '';
  const showInitialState = !debouncedQuery.trim();

  return {
    searchQuery,
    setSearchQuery,
    order,
    setOrder,
    searchType,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    hasData,
    showSkeleton,
    showEmptyState,
    showInitialState,
    handleClearSearch,
    handleSearchTypeChange,
    observerRef: ref,
  };
};
