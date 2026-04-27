type paginationProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const Pagination = ({ page, setPage }: paginationProps) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-5">
      <button
        type="button"
        aria-label="이전 페이지"
        className="bg-zinc-800 text-white px-6 py-3 rounded-full shadow-md
        hover:bg-[#b2dab1] transition-all duration-200 disabled:opacity-20
        cursor-pointer disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
      >{`<`}</button>
      <span>{page}PAGE</span>
      <button
        type="button"
        aria-label="다음 페이지"
        className="bg-zinc-800 text-white px-6 py-3 rounded-full shadow-md
        hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
        onClick={() => setPage((prev) => prev + 1)}
      >{`>`}</button>
    </div>
  );
};
