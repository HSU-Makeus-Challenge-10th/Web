import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSignin } from '../apis/auth';
import { useAuth } from '../context/AuthContext';
import type { UserInfo } from '../types/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await postSignin({ email, password });
      const { accessToken, id, name, email: userEmail } = res.data;
      const userInfo: UserInfo = { id, name, email: userEmail };
      login(accessToken, userInfo);
      // 이전 페이지(보호 라우트에서 넘어온 경우) 또는 홈으로
      const from = (window.history.state as { from?: string } | undefined)?.from ?? '/';
      navigate(from, { replace: true });
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded transition-colors font-medium"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm">
          계정이 없으신가요?{' '}
          <button onClick={() => navigate('/signup')} className="text-pink-400 hover:underline">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
