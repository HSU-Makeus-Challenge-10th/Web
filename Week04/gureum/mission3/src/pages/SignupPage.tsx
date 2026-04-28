import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { z } from 'zod';
import { postSignup } from '../api/auth';
import AuthField from '../components/auth/AuthField';
import AuthPageTitle from '../components/auth/AuthPageTitle';
import { signupSchema } from '../schemas/authSchema';
import type { SignupFormValues } from '../schemas/authSchema';

const stepOneSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
});

const stepTwoSchema = z
  .object({
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z
      .string()
      .min(1, '비밀번호를 다시 입력해주세요.')
      .min(6, '비밀번호는 6자 이상이어야 합니다.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, touchedFields },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');
  const watchedNickname = watch('nickname');

  const isStepOneValid = stepOneSchema.safeParse({ email: watchedEmail }).success;
  const isStepTwoValid = stepTwoSchema.safeParse({
    password: watchedPassword,
    confirmPassword: watchedConfirmPassword,
  }).success;
  const isStepThreeValid = watchedNickname.trim().length >= 2;

  const handleStepOneNext = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;
    setStep(2);
  };

  const handleStepTwoNext = async () => {
    const isValid = await trigger(['password', 'confirmPassword']);
    if (!isValid) return;
    setStep(3);
  };

  const onSubmit = async (values: SignupFormValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await postSignup({
        email: values.email,
        password: values.password,
        name: values.nickname,
      });

      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-black opacity-95 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthPageTitle
          title="회원가입"
          onBack={() => {
            if (step === 1) {
              navigate(-1);
              return;
            }
            setStep(step === 3 ? 2 : 1);
          }}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step >= 2 && (
            <div className="rounded-lg border border-gray-700 bg-zinc-900/60 px-4 py-3">
              <p className="text-xs text-gray-400">가입 이메일</p>
              <p className="text-sm text-white">{watchedEmail}</p>
            </div>
          )}

          {step === 1 && (
            <>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <AuthField
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={touchedFields.email ? errors.email?.message : undefined}
                  />
                )}
              />

              <button
                type="button"
                onClick={handleStepOneNext}
                disabled={!isStepOneValid}
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  isStepOneValid
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                다음
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <AuthField
                      type={showPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 입력해주세요"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={touchedFields.password ? errors.password?.message : undefined}
                    />
                    <button
                      type="button"
                      aria-label="비밀번호 표시 전환"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <AuthField
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력해주세요"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={
                        touchedFields.confirmPassword ? errors.confirmPassword?.message : undefined
                      }
                    />
                    <button
                      type="button"
                      aria-label="비밀번호 확인 표시 전환"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                )}
              />

              <button
                type="button"
                onClick={handleStepTwoNext}
                disabled={!isStepTwoValid}
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  isStepTwoValid
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                다음
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-4 rounded-lg border border-gray-700 bg-zinc-900/60 p-4">
                <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white">
                  👤
                </div>
                <div>
                  <p className="text-sm font-medium text-white">프로필 이미지</p>
                  <p className="text-xs text-gray-400">이미지 업로드 기능은 추후 구현 예정입니다.</p>
                </div>
              </div>

              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <AuthField
                    type="text"
                    placeholder="닉네임을 입력해주세요"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={touchedFields.nickname ? errors.nickname?.message : undefined}
                  />
                )}
              />

              {submitError && <p className="text-sm text-red-500">{submitError}</p>}

              <button
                type="submit"
                disabled={!isStepThreeValid || isSubmitting}
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  isStepThreeValid && !isSubmitting
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? '회원가입 처리 중...' : '회원가입 완료'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
