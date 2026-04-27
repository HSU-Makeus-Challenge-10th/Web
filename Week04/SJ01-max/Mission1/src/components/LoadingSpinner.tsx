export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-rose-500 animate-spin" />
      <p className="text-gray-400 text-sm">불러오는 중...</p>
    </div>
  );
}
