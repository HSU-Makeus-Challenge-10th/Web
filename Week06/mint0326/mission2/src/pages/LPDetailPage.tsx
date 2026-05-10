import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Heart, Pencil, Trash2, ChevronLeft, RefreshCw, AlertCircle, MoreVertical, Send } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

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

const LPDetailPage = () => {
    const { lpId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    const hasAlerted = useRef(false);

    const [commentSort, setCommentSort] = useState<'desc' | 'asc'>('desc');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const { ref: commentRef, inView: commentInView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    // 비로그인 사용자 접근 제한
    useEffect(() => {
        if (!isLoggedIn && !hasAlerted.current) {
            hasAlerted.current = true;
            alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [isLoggedIn, navigate, location]);

    // LP 상세 정보 조회
    const { data: lp, isLoading: isLpLoading, isError: isLpError } = useQuery({
        queryKey: ['lp', lpId],
        queryFn: async () => {
            const response = await api.get(`/v1/lps/${lpId}`);
            return response.data.data;
        },
        enabled: isLoggedIn,
    });

    // 댓글 무한 스크롤 조회
    const {
        data: commentData,
        fetchNextPage: fetchNextComments,
        hasNextPage: hasNextComments,
        isFetchingNextPage: isFetchingNextComments,
        isLoading: isCommentsLoading,
    } = useInfiniteQuery({
        queryKey: ['lpComments', lpId, commentSort],
        queryFn: async ({ pageParam = undefined }) => {
            // 💡 로컬 환경이라 응답이 너무 빨라서 스켈레톤이 안 보이는 것을 막기 위해 1.5초 딜레이 추가
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await api.get(`/v1/lps/${lpId}/comments`, {
                params: {
                    order: commentSort,
                    limit: 10,
                    cursor: pageParam,
                }
            });
            return response.data.data;
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: isLoggedIn,
    });

    // 스크롤 하단 도달 시 댓글 더 불러오기
    useEffect(() => {
        if (commentInView && hasNextComments && !isFetchingNextComments) {
            fetchNextComments();
        }
    }, [commentInView, hasNextComments, isFetchingNextComments, fetchNextComments]);

    // 댓글 작성 핸들러
    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post(`/v1/lps/${lpId}/comments`, { content });
            setContent('');
            // 작성 후 댓글 목록 초기화 및 재조회
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentSort] });
        } catch (e) {
            console.error('댓글 작성 실패:', e);
            alert('댓글 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLpLoading || !lp) {
        return (
            <div className="max-w-3xl mx-auto py-20 animate-pulse px-4">
                <div className="h-8 bg-[#1a1a1a] w-1/4 mb-10 rounded" />
                <div className="aspect-square max-w-md mx-auto bg-[#1a1a1a] rounded-full mb-10 shadow-2xl" />
                <div className="h-20 bg-[#1a1a1a] rounded w-full mb-8" />
            </div>
        );
    }

    const allComments = commentData?.pages.flatMap(page => page.data) || [];

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 pb-32">
            {/* 상단 네비게이션 */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-500 hover:text-white mb-10 transition-colors cursor-pointer group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">목록으로</span>
            </button>

            {/* 카드 컨테이너 */}
            <div className="bg-[#1e1e22] rounded-[32px] p-8 md:p-12 shadow-2xl mb-12">
                {/* 헤더 섹션 */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-[#ff007f] p-0.5">
                            <img
                                src={lp.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lp.author?.name}`}
                                alt={lp.author?.name}
                                className="w-full h-full rounded-full object-cover bg-[#2a2a2e]"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">{lp.author?.name || '익명'}</h3>
                            <span className="text-xs text-gray-500 font-medium">1일 전</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-gray-500 hover:text-[#ff007f] hover:bg-[#2a2a2e] rounded-full transition-all cursor-pointer">
                            <Pencil size={20} />
                        </button>
                        <button className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-[#2a2a2e] rounded-full transition-all cursor-pointer">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* 제목 및 레코드판 섹션 */}
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-center mb-12 tracking-tight">
                        {lp.title}
                    </h1>

                    <div className="relative group">
                        {/* 레코드판 슬리브(케이스) 효과 */}
                        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#1a1a1e] rounded-2xl flex items-center justify-center p-6 shadow-inner border border-[#2a2a2e]">
                            {/* 실제 레코드판 모양 */}
                            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#121214] group-hover:rotate-[360deg] transition-transform duration-[10000ms] linear infinite">
                                <img
                                    src={lp.thumbnail || 'https://via.placeholder.com/400?text=No+Image'}
                                    alt={lp.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                {/* 센터 라벨 구멍 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-24 md:h-24 bg-[#1e1e22] rounded-full border-[8px] border-[#2a2a2e] shadow-inner" />
                                </div>
                            </div>
                        </div>
                        {/* 플로팅 효과용 그림자 */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/40 blur-2xl rounded-full" />
                    </div>
                </div>

                {/* 본문 텍스트 */}
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium italic">
                        "{lp.content}"
                    </p>
                </div>

                {/* 태그 섹션 */}
                {lp.tags && lp.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {lp.tags.map((tag: any) => (
                            <button key={tag.id} className="px-5 py-2 bg-[#2a2a2e] text-[#a0a0b0] rounded-full text-sm font-medium hover:bg-[#3a3a3e] hover:text-white transition-all cursor-pointer">
                                # {tag.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* 좋아요 섹션 */}
                <div className="flex flex-col items-center">
                    <button className="group flex flex-col items-center gap-2 cursor-pointer">
                        <div className="p-4 rounded-full bg-[#1e1e22] hover:bg-[#2a2a2e] transition-all">
                            <Heart size={32} className={`${lp.likes?.length > 0 ? 'fill-[#ff007f] text-[#ff007f]' : 'text-[#ff007f]'} group-hover:scale-125 transition-transform`} />
                        </div>
                        <span className="font-bold text-xl">{lp.likes?.length || 0}</span>
                    </button>
                </div>
            </div>

            {/* 댓글 섹션 */}
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
        </div>
    );
};

export default LPDetailPage;
