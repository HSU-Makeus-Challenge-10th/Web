import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateSignin } from '../utils/validate';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryFrom = new URLSearchParams(location.search).get('redirect');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const signinMutation = useMutation({
    mutationFn: (values: { email: string; password: string }) => login(values),
    onSuccess: (success) => {
      if (!success) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }
      const from = (location.state as { from?: string } | null)?.from ?? queryFrom ?? '/';
      navigate(from, { replace: true });
    },
    onError: () => setError('이메일 또는 비밀번호가 올바르지 않습니다.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignin({ email, password });
    setErrors(validationErrors);
    if (validationErrors.email || validationErrors.password) return;
    setError(null);
    signinMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={signinMutation.isPending}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded transition-colors font-medium"
          >
            {signinMutation.isPending ? '로그인 중...' : '로그인'}
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
