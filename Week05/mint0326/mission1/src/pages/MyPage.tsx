import { useAuth } from '../contexts/AuthContext';

const MyPage = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20">
            <h1 className="text-2xl mb-4 text-white">마이페이지에 오신 것을 환영합니다!</h1>
            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-[#ff007f] text-white rounded font-bold"
            >
                로그아웃
            </button>
        </div>
    );
};

export default MyPage;