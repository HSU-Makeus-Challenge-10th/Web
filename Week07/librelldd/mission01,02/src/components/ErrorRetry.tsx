
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

const ErrorRetry = ({ message = "데이터를 불러오는 중 오류가 발생했습니다.", onRetry }: ErrorRetryProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{message}</h2>
      <p className="text-gray-500 dark:text-gray-400">네트워크 연결 상태를 확인하고 다시 시도해 주세요.</p>
      <button
        onClick={onRetry}
        className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium shadow-md"
      >
        <RefreshCw className="w-4 h-4" />
        <span>다시 시도</span>
      </button>
    </div>
  );
};

export default ErrorRetry;
