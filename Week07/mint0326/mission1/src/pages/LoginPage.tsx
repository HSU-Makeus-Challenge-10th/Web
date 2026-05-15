import { ChevronLeft } from 'lucide-react';
import { useLogin } from '../hooks/auth/useLogin';

const LoginPage = () => {
  const { state, actions } = useLogin();

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm px-6">
        {/* 뒤로 가기 버튼 */}
        <div className="flex items-center justify-center mb-8 relative">
          <button
            onClick={() => actions.navigate(-1)}
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
          <button
            type="button"
            onClick={actions.handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-black border border-[#3a3a3a] rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">구글 로그인</span>
          </button>

          {/* OR */}
          <div className="flex items-center gap-4 text-[#7a7a7a]">
            <div className="flex-1 h-[1px] bg-[#3a3a3a]"></div>
            <span className="text-xs font-semibold uppercase">OR</span>
            <div className="flex-1 h-[1px] bg-[#3a3a3a]"></div>
          </div>

          {/* 이메일/비밀번호 입력 */}
          <form className="space-y-4" onSubmit={actions.handleSubmit(actions.onSubmit)}>
            <div className="space-y-1">
              {/* 이메일 */}
              <input
                type="email"
                {...actions.register('email')}
                placeholder="이메일을 입력해주세요!"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${state.errors.email ? 'border-red-500' : 'border-[#3a3a3a]'
                  } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
              />
              {state.errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              {/* 비밀번호 */}
              <input
                type="password"
                {...actions.register('password')}
                placeholder="비밀번호를 입력해주세요!"
                autoComplete="current-password"
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${state.errors.password ? 'border-red-500' : 'border-[#3a3a3a]'
                  } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
              />
              {state.errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.password.message}</p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!state.isValid || state.isPending}
              className={`w-full py-3 mt-4 rounded text-sm font-bold transition-colors cursor-pointer ${state.isValid && !state.isPending
                ? 'bg-[#ff007f] text-white hover:bg-[#e60072]'
                : 'bg-[#2a2a2a] text-[#7a7a7a] cursor-not-allowed'
                }`}
            >
              {state.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="text-center pt-4">
            <span className="text-[#7a7a7a] text-sm">회원이 아니신가요? </span>
            <button
              onClick={() => actions.navigate('/signup')}
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

