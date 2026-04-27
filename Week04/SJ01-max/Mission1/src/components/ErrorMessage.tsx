interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-3">
      <div className="text-5xl">😕</div>
      <h2 className="text-xl font-bold text-white">오류가 발생했습니다</h2>
      <p className="text-gray-400 text-sm text-center max-w-md">
        {message || '데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
      </p>
    </div>
  );
}
