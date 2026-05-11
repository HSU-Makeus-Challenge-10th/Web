export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div
        className="size-12 animate-spin rounded-full border-6 
    border-t-transparent border-blue-500"
        role="status"
      >
        <span className="sr-only">로딩 중...</span>
      </div>
    </div>
  );
};
