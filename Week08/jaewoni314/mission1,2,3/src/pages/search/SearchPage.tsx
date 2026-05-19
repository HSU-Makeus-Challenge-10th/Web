import Error from '../../components/error/Error';
import OrderSelector from '../../components/orderSelector/OrderSelector';
import { useSearchPage } from '../../hooks/search/useSearchPage';
import SearchInput from './components/SearchInput';
import SearchTypeDropdown from './components/SearchTypeDropdown';
import SearchEmptyState from './components/SearchEmptyState';
import SearchResults from './components/SearchResults';

const SearchPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    order,
    setOrder,
    searchType,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    data,
    isFetchingNextPage,
    isError,
    error,
    showSkeleton,
    showEmptyState,
    showInitialState,
    handleClearSearch,
    handleSearchTypeChange,
    observerRef,
  } = useSearchPage();

  if (isError) return <Error message={error?.message || 'An error occurred'} />;

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="relative mb-4 flex gap-2">
          <SearchInput
            searchQuery={searchQuery}
            searchType={searchType}
            onSearchChange={setSearchQuery}
            onClearSearch={handleClearSearch}
          />
          <SearchTypeDropdown
            searchType={searchType}
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            onSelect={handleSearchTypeChange}
            dropdownRef={dropdownRef}
          />
        </div>
        <OrderSelector order={order} onOrderChange={setOrder} />
      </div>

      {showInitialState && <SearchEmptyState type="initial" />}
      {showEmptyState && <SearchEmptyState type="no-results" />}

      {!showInitialState && !showEmptyState && (
        <SearchResults
          data={data}
          isFetchingNextPage={isFetchingNextPage}
          showSkeleton={showSkeleton}
          observerRef={observerRef}
        />
      )}
    </div>
  );
};

export default SearchPage;
