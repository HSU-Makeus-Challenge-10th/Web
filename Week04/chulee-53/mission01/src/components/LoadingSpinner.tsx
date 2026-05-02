export const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-[#F3F4F4]" role="status">
                <span className="sr-only">로딩 중...</span>
            </div>
        </div>
    );
}