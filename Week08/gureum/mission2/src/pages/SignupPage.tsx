import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSignup } from '../apis/auth';
import { validateSignup } from '../utils/validate';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignup({ name, email, password, passwordConfirm });
    setErrors(validationErrors);
    if (Object.values(validationErrors).some((v) => v)) return;
    setError(null);
    setIsLoading(true);
    try {
      await postSignup({ name, email, password });
      navigate('/login', { replace: true });
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="닉네임"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
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
              placeholder="비밀번호 (8~20자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            {errors.passwordConfirm && (
              <p className="text-red-400 text-xs mt-1">{errors.passwordConfirm}</p>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded transition-colors font-medium"
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm">
          이미 계정이 있으신가요?{' '}
          <button onClick={() => navigate('/login')} className="text-pink-400 hover:underline">
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
