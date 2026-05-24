interface SearchEmptyStateProps {
  type: 'initial' | 'no-results';
}

const SearchEmptyState = ({ type }: SearchEmptyStateProps) => {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      {type === 'initial' ? '검색어를 입력해주세요' : '검색 결과가 없습니다'}
    </div>
  );
};

export default SearchEmptyState;
