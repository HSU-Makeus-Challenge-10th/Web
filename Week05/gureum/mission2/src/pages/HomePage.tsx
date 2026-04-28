import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-black opacity-95 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center space-y-4">
        <h2 className="text-3xl font-bold">UMC 5주차 미션2</h2>
        <p className="text-gray-300">RefreshToken을 활용하여 지속적인 로그인을 구현한 미션2 프로젝트입니다.</p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link
            to="/login"
            className="px-5 py-3 rounded-md bg-pink-500 font-semibold hover:bg-pink-600 transition-colors"
          >
            로그인 보러가기
          </Link>
          <Link
            to="/signup"
            className="px-5 py-3 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors"
          >
            회원가입 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
