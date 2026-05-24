import { ChevronDown } from 'lucide-react';
import type { SearchType } from './SearchInput';

interface SearchTypeDropdownProps {
  searchType: SearchType;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (type: SearchType) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const SearchTypeDropdown = ({
  searchType,
  isOpen,
  onToggle,
  onSelect,
  dropdownRef,
}: SearchTypeDropdownProps) => {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="h-full px-4 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:border-gray-500 flex items-center gap-2 whitespace-nowrap"
      >
        {searchType === 'title' ? '제목' : '태그'}
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <button
            onClick={() => onSelect('title')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-700 rounded-t-lg ${
              searchType === 'title' ? 'bg-gray-700 text-pink-500' : 'text-white'
            }`}
          >
            제목
          </button>
          <button
            onClick={() => onSelect('tag')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-700 rounded-b-lg ${
              searchType === 'tag' ? 'bg-gray-700 text-pink-500' : 'text-white'
            }`}
          >
            태그
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTypeDropdown;
