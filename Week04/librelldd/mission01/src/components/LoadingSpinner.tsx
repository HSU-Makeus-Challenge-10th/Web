export const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div 
                className='size-12 animate-spin rounded-full border-2 
                border-purple-500/30 border-t-purple-200'
                role='status'
            />
            <span className="text-purple-200 text-sm font-light tracking-widest">LOADING</span>
        </div>
    );
}