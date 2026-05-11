import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft } from 'lucide-react';
import { useLpDetail } from '../hooks/useLpDetail';
import { LpInfoSection } from '../components/LpDetail/LpInfoSection';
import { CommentSection } from '../components/LpDetail/CommentSection';

const LpDetailPage = () => {
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

    // LP 상세 정보 조회 (스켈레톤 렌더링을 위함)
    const { data: lp, isLoading: isLpLoading } = useLpDetail(lpId, isLoggedIn);

    if (isLpLoading || !lp) {
        return (
            <div className="max-w-3xl mx-auto py-20 animate-pulse px-4">
                <div className="h-8 bg-[#1a1a1a] w-1/4 mb-10 rounded" />
                <div className="aspect-square max-w-md mx-auto bg-[#1a1a1a] rounded-full mb-10 shadow-2xl" />
                <div className="h-20 bg-[#1a1a1a] rounded w-full mb-8" />
            </div>
        );
    }

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

            <LpInfoSection lp={lp} />

            <CommentSection lpId={lpId} isLoggedIn={isLoggedIn} />
        </div>
    );
};

export default LpDetailPage;
