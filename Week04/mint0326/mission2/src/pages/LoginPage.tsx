import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import useForm from '../hooks/useForm';
import { useCallback } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();

  // 유효성 검사 함수
  const validate = useCallback((values: { email: string; password: string }) => {
    const errors: { email?: string; password?: string } = {};

    // 이메일
    if (!values.email) {
      errors.email = '이메일을 입력해주세요!';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        errors.email = '유효하지 않은 이메일 형식입니다.';
      }
    }

    // 비밀번호
    if (!values.password) {
      errors.password = '비밀번호를 입력해주세요!';
    } else if (values.password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    return errors;
  }, []);

  const { values, errors, touched, handleChange, handleBlur, isValid } = useForm({
    initialValues: { email: '', password: '' },
    validate,
  });

  const isFormValid = isValid;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white pt-16">
      <div className="w-full max-w-sm px-6">
        {/* 뒤로 가기 버튼. */}
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
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              {/* 이메일 */}
              <input
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="이메일을 입력해주세요!"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${errors.email ? 'border-red-500' : 'border-[#3a3a3a]'
                  } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              {/* 비밀번호 */}
              <input
                type="password"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="비밀번호를 입력해주세요!"
                autoComplete="current-password"
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${errors.password ? 'border-red-500' : 'border-[#3a3a3a]'
                  } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* 로그인 버튼. */}
            <button
              disabled={!isFormValid}
              className={`w-full py-3 mt-4 rounded text-sm font-bold transition-colors cursor-pointer ${isFormValid
                ? 'bg-[#ff007f] text-white hover:bg-[#e60072]'
                : 'bg-[#2a2a2a] text-[#7a7a7a] cursor-not-allowed'
                }`}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
