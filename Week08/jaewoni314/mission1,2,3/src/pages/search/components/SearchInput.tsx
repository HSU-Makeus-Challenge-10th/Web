import { Search, X } from 'lucide-react';

export type SearchType = 'title' | 'tag';

interface SearchInputProps {
  searchQuery: string;
  searchType: SearchType;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

const SearchInput = ({
  searchQuery,
  searchType,
  onSearchChange,
  onClearSearch,
}: SearchInputProps) => {
  return (
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder={searchType === 'title' ? '검색어를 입력하세요' : '태그를 입력하세요'}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-black text-white border border-gray-700 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-gray-500"
      />
      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
