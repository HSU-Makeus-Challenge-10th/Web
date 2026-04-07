interface LoadingSpinnerProps {
  message: string;
  size?: 'md' | 'lg';
}

const sizeClassMap = {
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
};

const LoadingSpinner = ({ message, size = 'md' }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full ${sizeClassMap[size]} border-4 border-blue-500 border-t-transparent mb-4 mx-auto`}
        />
        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
