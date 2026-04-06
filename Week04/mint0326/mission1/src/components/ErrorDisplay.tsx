interface ErrorDisplayProps {
    message?: string;
}

const ErrorDisplay = ({ message = '데이터를 불러오는 중에 문제가 발생했습니다.' }: ErrorDisplayProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white p-4 text-center">
            <h1 className="text-2xl font-bold mb-2">에러가 발생했습니다</h1>
            <p className="text-gray-400 mb-6 max-w-md">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg font-bold"
            >
                다시 시도하기
            </button>
        </div>
    );
};

export default ErrorDisplay;
