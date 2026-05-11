import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { RefreshCw, MoreVertical } from 'lucide-react';
import { useLpComments } from '../../hooks/useLpComments';

interface CommentSectionProps {
    lpId: string | undefined;
    isLoggedIn: boolean;
}

const CommentSkeleton = () => (
    <div className="flex gap-4 mb-6 animate-pulse">
        <div className="w-10 h-10 bg-[#2a2a2e] rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#2a2a2e] w-24 rounded" />
            <div className="h-3 bg-[#2a2a2e] w-full rounded" />
            <div className="h-3 bg-[#2a2a2e] w-3/4 rounded" />
        </div>
    </div>
);

export const CommentSection = ({ lpId, isLoggedIn }: CommentSectionProps) => {
    const [commentSort, setCommentSort] = useState<'desc' | 'asc'>('desc');
    const [content, setContent] = useState('');

    const { ref: commentRef, inView: commentInView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    const {
        data: commentData,
        fetchNextPage: fetchNextComments,
        hasNextPage: hasNextComments,
        isFetchingNextPage: isFetchingNextComments,
        isLoading: isCommentsLoading,
        addComment,
        isSubmitting
    } = useLpComments(lpId, commentSort, isLoggedIn);

    useEffect(() => {
        if (commentInView && hasNextComments && !isFetchingNextComments) {
            fetchNextComments();
        }
    }, [commentInView, hasNextComments, isFetchingNextComments, fetchNextComments]);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        try {
            await addComment(content);
            setContent('');
        } catch (e) {
            // Error handling is inside the hook
        }
    };

    const allComments = commentData?.pages.flatMap(page => page.data) || [];

    return (
        <div className="bg-[#1e1e22] rounded-[32px] p-8 md:p-12 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    댓글 <span className="text-[#ff007f] text-lg">{allComments.length}</span>
                </h2>
                <div className="flex bg-[#121214] rounded-lg p-1 border border-[#2a2a2e]">
                    <button
                        onClick={() => setCommentSort('asc')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${commentSort === 'asc' ? 'bg-[#2a2a2e] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        오래된순
                    </button>
                    <button
                        onClick={() => setCommentSort('desc')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${commentSort === 'desc' ? 'bg-[#2a2a2e] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        최신순
                    </button>
                </div>
            </div>

            {/* 댓글 입력란 */}
            <div className="relative mb-10">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="댓글을 입력해주세요"
                            className="w-full bg-[#121214] border border-[#2a2a2e] rounded-xl py-3.5 px-5 pr-20 focus:outline-none focus:border-[#ff007f] transition-all text-sm"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className={`absolute right-2 top-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isSubmitting || !content.trim() 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-[#ff007f] text-white hover:bg-[#e60072]'
                            }`}
                        >
                            {isSubmitting ? '작성중' : '작성'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-8">
                {isCommentsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)
                ) : (
                    allComments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-[#ff007f] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                                <img
                                    src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.author?.name || '익명')}`}
                                    alt={comment.author?.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.author?.name || '익명')}`;
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-sm">{comment.author?.name || '익명'}</h4>
                                    <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}

                {/* 다음 페이지 스켈레톤 */}
                {isFetchingNextComments && (
                    Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={`next-${i}`} />)
                )}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={commentRef} className="h-20 flex items-center justify-center">
                {isFetchingNextComments && (
                    <div className="flex items-center gap-2 text-[#ff007f] animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold">댓글 더 불러오는 중...</span>
                    </div>
                )}
            </div>

            {!isCommentsLoading && allComments.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-sm">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                </div>
            )}
        </div>
    );
};
