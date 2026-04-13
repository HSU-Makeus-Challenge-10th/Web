import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { loginSchema } from '../schemas/authSchema';
import type { LoginFormValues } from '../schemas/authSchema';

import useLocalStorage from '../hooks/useLocalStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useLocalStorage<string | null>('accessToken', null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormValues) => {
    // 로그인 성공 시뮬레이션
    setToken('dummy-jwt-token-for-mission3');

    alert('로그인에 성공했습니다!');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white pt-16">
      <div className="w-full max-w-sm px-6">
        {/* 뒤로 가기 버튼 */}
        <div className="flex items-center justify-center mb-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-1 hover:bg-[#1a1a1a] rounded-full transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">로그인</h1>
        </div>

        {/* 로그인 폼 */}
        <div className="space-y-6">
          {/* 구글 로그인 버튼 */}
          <button className="w-full flex items-center justify-center gap-3 py-2.5 bg-black border border-[#3a3a3a] rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer">
            <span className="text-sm font-medium">구글 로그인</span>
          </button>

          {/* OR */}
          <div className="flex items-center gap-4 text-[#7a7a7a]">
            <div className="flex-1 h-[1px] bg-[#3a3a3a]"></div>
            <span className="text-xs font-semibold uppercase">OR</span>
            <div className="flex-1 h-[1px] bg-[#3a3a3a]"></div>
          </div>

          {/* 이메일/비밀번호 입력 */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              {/* 이메일 */}
              <input
                type="email"
                {...register('email')}
                placeholder="이메일을 입력해주세요!"
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${errors.email ? 'border-red-500' : 'border-[#3a3a3a]'
                  } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              {/* 비밀번호 */}
              <input
                type="password"
                {...register('password')}
                placeholder="비밀번호를 입력해주세요!"
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${errors.password ? 'border-red-500' : 'border-[#3a3a3a]'
                  } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 mt-4 rounded text-sm font-bold transition-colors cursor-pointer ${isValid
                ? 'bg-[#ff007f] text-white hover:bg-[#e60072]'
                : 'bg-[#2a2a2a] text-[#7a7a7a] cursor-not-allowed'
                }`}
            >
              로그인
            </button>
          </form>

          <div className="text-center pt-4">
            <span className="text-[#7a7a7a] text-sm">회원이 아니신가요? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-[#ff007f] text-sm font-bold hover:underline cursor-pointer"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

