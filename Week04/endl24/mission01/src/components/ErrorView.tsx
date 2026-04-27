interface ErrorViewProps {
  message: string | null;
  onRetry?: () => void; 
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] bg-black text-white gap-4">
      <span className="text-5xl" role="img" aria-label="warning">⚠️</span>
      <p className="text-2xl font-bold text-red-500">
        {message || "알 수 없는 에러가 발생했습니다."}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold 
                     hover:bg-gray-300 transition-colors shadow-lg"
        >
          다시 시도하기
        </button>
      )}
    </div>
  );
}