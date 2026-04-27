import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { signIn, saveTokens } from '../lib/authApi';

interface LoginValues extends Record<string, string> {
  email: string;
  password: string;
}

function validate(values: LoginValues): Partial<Record<keyof LoginValues, string>> {
  const errors: Partial<Record<keyof LoginValues, string>> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (values.email && !emailRegex.test(values.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }
  if (values.password && values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.';
  }
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const validateFn = useCallback(validate, []);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, isValid } = useForm<LoginValues>({
    initialValues: { email: '', password: '' },
    validate: validateFn,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setApiError('');
    try {
      const data = await signIn(values.email, values.password);
      saveTokens(data.accessToken, data.refreshToken);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApiError(msg || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* 상단 뒤로가기 + 제목 */}
        <div className="relative flex items-center justify-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-white text-xl hover:text-pink-400 transition-colors"
            aria-label="뒤로 가기"
          >
            {'<'}
          </button>
          <h2 className="text-white text-lg font-medium">로그인</h2>
        </div>

        {/* 구글 로그인 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-lg py-3 text-white text-sm hover:bg-gray-800 transition-colors mb-5"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* API 에러 메시지 */}
        {apiError && (
          <div className="mb-3 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-xs">
            {apiError}
          </div>
        )}

        {/* 이메일/비밀번호 폼 */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="이메일을 입력해주세요!"
              className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
                touched.email && errors.email
                  ? 'border-red-500'
                  : touched.email && !errors.email && values.email
                  ? 'border-pink-500'
                  : 'border-gray-700 focus:border-pink-500'
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="비밀번호를 입력해주세요!"
              className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
                touched.password && errors.password
                  ? 'border-red-500'
                  : touched.password && !errors.password && values.password
                  ? 'border-pink-500'
                  : 'border-gray-700 focus:border-pink-500'
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full rounded-lg py-3 text-sm font-medium transition-all mt-1 ${
              isValid && !isLoading
                ? 'bg-pink-500 hover:bg-pink-400 text-white cursor-pointer'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
