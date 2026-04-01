interface ErrorStateProps {
  message: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ErrorState = ({
  message,
  icon = '⚠️',
  actionLabel,
  onAction,
}: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <p className="text-xl text-red-500 mb-4">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
