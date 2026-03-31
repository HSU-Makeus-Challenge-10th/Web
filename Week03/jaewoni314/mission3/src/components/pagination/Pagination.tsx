import PaginationButton from './PaginationButton';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8 mb-4">
      <PaginationButton
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </PaginationButton>

      <span className="px-4 py-2 text-gray-700 font-medium">
        {currentPage} / {totalPages}
      </span>

      <PaginationButton
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        {'>'}
      </PaginationButton>
    </div>
  );
};

export default Pagination;
