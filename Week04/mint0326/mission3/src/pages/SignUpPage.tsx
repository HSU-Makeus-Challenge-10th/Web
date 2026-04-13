import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Mail, Eye, EyeOff, User } from 'lucide-react';
import { signUpSchema } from '../schemas/authSchema';
import type { SignUpFormValues } from '../schemas/authSchema';
import useLocalStorage from '../hooks/useLocalStorage';

const SignUpPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useLocalStorage<string | null>('accessToken', null);

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const passwordConfirmValue = watch('passwordConfirm');
  const nicknameValue = watch('nickname');

  const handleNext = async () => {
    let isStepValid = false;

    if (step === 1) {
      isStepValid = await trigger('email');
      if (isStepValid) setStep(2);
    } else if (step === 2) {
      isStepValid = await trigger(['password', 'passwordConfirm']);
      if (isStepValid) setStep(3);
    } else if (step === 3) {
      isStepValid = await trigger('nickname');
      if (isStepValid) {
        handleSubmit(onSubmit)();
      }
    }
  };

  const onSubmit = () => {
    setToken('dummy-signup-token');
    alert('회원가입이 완료되었습니다!');
    navigate('/');
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* 구글 로그인 버튼 */}
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-black border border-[#3a3a3a] rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <span className="text-sm font-medium">구글 로그인</span>
            </button>

            {/* OR */}
            <div className="flex items-center gap-4 text-[#7a7a7a]">
              <div className="flex-1 h-[1px] bg-[#3a3a3a]"></div>
              <span className="text-xs font-semibold uppercase">OR</span>
              <div className="flex-1 h-[1px] bg-[#3a3a3a]"></div>
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-4">
              <div className="space-y-1">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="이메일을 입력해주세요!"
                  className={`w-full px-4 py-3.5 bg-[#1a1a1a] border ${errors.email ? 'border-red-500' : 'border-[#3a3a3a]'
                    } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* 다음 버튼 */}
              <button
                type="button"
                onClick={handleNext}
                disabled={!emailValue || !!errors.email}
                className={`w-full py-3.5 mt-4 rounded text-sm font-bold transition-colors cursor-pointer ${emailValue && !errors.email
                  ? 'bg-[#ff007f] text-white hover:bg-[#e60072]'
                  : 'bg-[#2a2a2a] text-[#7a7a7a] cursor-not-allowed'
                  }`}
              >
                다음
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* 입력된 이메일 표시 */}
            <div className="flex items-center gap-3 px-1">
              <Mail size={18} className="text-[#7a7a7a]" />
              <span className="text-sm text-[#eaeaea] font-medium">{emailValue}</span>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="비밀번호를 입력해주세요!"
                    className={`w-full pl-4 pr-12 py-3.5 bg-[#1a1a1a] border ${errors.password ? 'border-red-500' : 'border-[#3a3a3a]'
                      } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-[#eaeaea] transition-colors cursor-pointer"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* 비밀번호 재확인 입력 */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('passwordConfirm')}
                    placeholder="비밀번호를 다시 한 번 입력해주세요!"
                    className={`w-full pl-4 pr-12 py-3.5 bg-[#1a1a1a] border ${errors.passwordConfirm ? 'border-red-500' : 'border-[#3a3a3a]'
                      } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-[#eaeaea] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {(errors.passwordConfirm || (passwordValue && passwordConfirmValue && passwordValue !== passwordConfirmValue)) && (
                  <p className="text-red-500 text-xs mt-2 ml-1">
                    {errors.passwordConfirm?.message || "비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              {/* 다음 버튼 */}
              <button
                type="button"
                onClick={handleNext}
                disabled={!!errors.password || !!errors.passwordConfirm || !passwordValue || !passwordConfirmValue || passwordValue !== passwordConfirmValue}
                className={`w-full py-3.5 mt-4 rounded text-sm font-bold transition-colors cursor-pointer ${!errors.password && !errors.passwordConfirm && passwordValue && passwordConfirmValue && passwordValue === passwordConfirmValue
                  ? 'bg-[#ff007f] text-white hover:bg-[#e60072]'
                  : 'bg-[#2a2a2a] text-[#7a7a7a] cursor-not-allowed'
                  }`}
              >
                다음
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10">
            {/* 프로필 이미지 UI */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-32 h-32 bg-[#2a2a2a] rounded-full flex items-center justify-center border-4 border-[#1a1a1a] shadow-lg mb-2 overflow-hidden relative group">
                <User size={64} className="text-[#7a7a7a]" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs font-bold text-white">편집</span>
                </div>
              </div>
            </div>

            {/* 닉네임 입력 */}
            <div className="space-y-4">
              <div className="space-y-1">
                <input
                  type="text"
                  {...register('nickname')}
                  placeholder="닉네임을 입력해주세요!"
                  className={`w-full px-4 py-3.5 bg-[#1a1a1a] border ${errors.nickname ? 'border-red-500' : 'border-[#3a3a3a]'
                    } rounded text-sm placeholder-[#7a7a7a] focus:outline-none focus:border-[#ff007f] transition-colors font-medium`}
                />
                {errors.nickname && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.nickname.message}</p>
                )}
              </div>

              {/* 회원가입 완료 버튼 */}
              <button
                type="button"
                onClick={handleNext}
                disabled={!nicknameValue || !!errors.nickname}
                className={`w-full py-3.5 mt-8 rounded text-sm font-bold transition-all duration-300 cursor-pointer shadow-lg ${nicknameValue && !errors.nickname
                  ? 'bg-gradient-to-r from-[#ff007f] to-[#e60072] text-white hover:scale-[1.02] active:scale-95'
                  : 'bg-[#2a2a2a] text-[#7a7a7a] cursor-not-allowed'
                  }`}
              >
                회원가입 완료
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white pt-16">
      <div className="w-full max-w-sm px-6">
        {/* 뒤로 가기 버튼 */}
        <div className="flex items-center justify-center mb-10 relative">
          <button
            onClick={handleBack}
            className="absolute left-0 p-1 hover:bg-[#1a1a1a] rounded-full transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">회원가입</h1>
        </div>

        {/* 회원가입 폼 */}
        <div className="space-y-8">
          {renderStep()}

          {step === 1 && (
            <div className="text-center pt-2">
              <span className="text-[#7a7a7a] text-sm">이미 계정이 있으신가요? </span>
              <button
                onClick={() => navigate('/login')}
                className="text-[#ff007f] text-sm font-bold hover:underline cursor-pointer"
              >
                로그인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

