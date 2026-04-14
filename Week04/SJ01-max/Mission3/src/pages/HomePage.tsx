import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-24 gap-6">
      <h1 className="text-4xl font-bold text-white">
        <span className="text-pink-500">돌려돌려</span>LP판
      </h1>
      <p className="text-gray-400 text-sm">나만의 LP 컬렉션을 공유하세요.</p>
      <div className="flex gap-3">
        <Link to="/login" className="px-6 py-3 border border-gray-600 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
          로그인
        </Link>
        <Link to="/signup" className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white rounded-lg text-sm font-medium transition-colors">
          회원가입
        </Link>
      </div>
    </div>
  );
}
