import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { signIn } from '../lib/authApi';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AuthTokens } from '../lib/schemas';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.').min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [, setTokens] = useLocalStorage<AuthTokens | null>('auth_tokens', null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      const result = await signIn(data.email, data.password);
      setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
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
        <div className="relative flex items-center justify-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 text-white text-xl hover:text-pink-400 transition-colors"
          >
            {'<'}
          </button>
          <h2 className="text-white text-lg font-medium">로그인</h2>
        </div>

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

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {apiError && (
          <div className="mb-3 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-xs">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              {...register('email')}
              className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-700 focus:border-pink-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              {...register('password')}
              className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-700 focus:border-pink-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full rounded-lg py-3 text-sm font-medium transition-all mt-1 ${
              isValid && !isLoading ? 'bg-pink-500 hover:bg-pink-400 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
