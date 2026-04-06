interface LoadingSpinnerProps {
    text?: string;
}

const LoadingSpinner = ({ text = '정보를 불러오고 있습니다...' }: LoadingSpinnerProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-xl font-medium">{text}</p>
        </div>
    );
};

export default LoadingSpinner;
