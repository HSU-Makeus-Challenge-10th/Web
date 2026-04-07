interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationProps) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`w-12 h-12 rounded-full font-bold text-xl transition-colors ${
          currentPage === 1
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-pink-500 text-white hover:bg-pink-600'
        }`}
      >
        &lt;
      </button>

      <span className="text-gray-800 font-semibold mx-4">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className={`w-12 h-12 rounded-full font-bold text-xl transition-colors ${
          currentPage >= totalPages
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-pink-500 text-white hover:bg-pink-600'
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
