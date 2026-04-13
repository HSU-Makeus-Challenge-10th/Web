import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

const HomePage = () => {
    // 1. 현재 주소를 가져오는 훅 추가
    const location = useLocation();

    return (
        <div className="min-h-screen bg-black flex flex-col text-purple-500">
            <Navbar />
            
            {/* 2. 주소가 정확히 "/" 일 때만 망원경 영역을 보여줍니다 */}
            {location.pathname === "/" && (
                <div className="flex flex-1 flex-col items-center justify-center py-20">
                    <span className="text-9xl animate-bounce">
                        🔭
                    </span>
                    <p className="mt-4 text-purple-300 text-xl font-Pretendard">
                        새로운 영화를 탐색해보세요
                    </p>
                </div>
            )}

            {/* 하위 페이지 컨텐츠 (인기 영화 등 다른 페이지로 가면 이 부분만 나옵니다) */}
            <div className="px-10">
                <Outlet />
            </div>
        </div>
    );
};

export default HomePage;