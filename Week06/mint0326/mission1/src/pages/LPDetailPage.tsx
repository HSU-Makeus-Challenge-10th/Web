import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Heart, Pencil, Trash2, ChevronLeft, RefreshCw, AlertCircle } from 'lucide-react';

const LPDetailPage = () => {
    const { lpId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    const hasAlerted = useRef(false);

    // 비로그인 사용자 접근 제한
    useEffect(() => {
        if (!isLoggedIn && !hasAlerted.current) {
            hasAlerted.current = true;
            alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [isLoggedIn, navigate, location]);
    
    // 데이터 로딩 중이거나 에러 상태일 때의 처리는 유지
    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['lp', lpId],
        queryFn: async () => {
            const response = await api.get(`/v1/lps/${lpId}`);
            return response.data.data;
        },
        staleTime: 1000 * 60,
        enabled: isLoggedIn, // 로그인 상태일 때만 쿼리 실행
    });

    if (isLoading || !data) {
        return (
            <div className="max-w-3xl mx-auto py-20 animate-pulse px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1a1a1a] rounded-full" />
                        <div className="h-4 bg-[#1a1a1a] w-24 rounded" />
                    </div>
                    <div className="h-4 bg-[#1a1a1a] w-16 rounded" />
                </div>
                <div className="h-10 bg-[#1a1a1a] w-1/2 mb-10 mx-auto" />
                <div className="aspect-square max-w-md mx-auto bg-[#1a1a1a] rounded-full mb-10" />
                <div className="h-20 bg-[#1a1a1a] rounded w-full mb-8" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-6">정보를 불러오지 못했습니다</h2>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-8 py-3 bg-[#ff007f] text-white rounded-full font-bold hover:bg-[#e60072] transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    다시 시도
                </button>
            </div>
        );
    }

    const lp = data;
    // 작성일 계산 (간이 구현: 1일 전 등)
    const timeAgo = '1일 전';

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* 상단 네비게이션 */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-500 hover:text-white mb-10 transition-colors cursor-pointer group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">목록으로</span>
            </button>

            {/* 카드 컨테이너 */}
            <div className="bg-[#1e1e22] rounded-[32px] p-8 md:p-12 shadow-2xl">
                {/* 헤더 섹션 */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#2a2a2e] rounded-full overflow-hidden border border-[#3a3a3e]">
                            <img src={lp.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lp.author?.name}`} alt={lp.author?.name} />
                        </div>
                        <span className="font-bold text-lg">{lp.author?.name || '익명'}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{timeAgo}</span>
                </div>

                {/* 제목 및 액션 버튼 */}
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-3xl font-bold tracking-tight">{lp.title}</h1>
                    <div className="flex gap-4 text-gray-500">
                        <button className="hover:text-white transition-colors cursor-pointer"><Pencil size={20} /></button>
                        <button className="hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={20} /></button>
                    </div>
                </div>

                {/* LP 레코드판 섹션 */}
                <div className="flex justify-center mb-16">
                    <div className="relative group">
                        {/* 레코드판 커버/배경 */}
                        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#1a1a1e] rounded-2xl flex items-center justify-center p-6 shadow-inner border border-[#2a2a2e]">
                            {/* 실제 레코드판 모양 */}
                            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#121214] group-hover:rotate-[360deg] transition-transform duration-[10000ms] linear infinite">
                                <img
                                    src={lp.thumbnail || 'https://via.placeholder.com/400?text=No+Image'}
                                    alt={lp.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                {/* 레코드판 구멍 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-24 md:h-24 bg-[#1e1e22] rounded-full border-[8px] border-[#2a2a2e] shadow-inner" />
                                </div>
                            </div>
                        </div>
                        {/* 플로팅 효과용 그림자 */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/40 blur-2xl rounded-full" />
                    </div>
                </div>

                {/* 본문 내용 */}
                <div className="text-center mb-12">
                    <p className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto">
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
                        <span className="font-bold text-xl">{lp.likes?.length || 1}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LPDetailPage;
