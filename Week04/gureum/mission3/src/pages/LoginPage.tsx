import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSignin } from '../api/auth';
import AuthDivider from '../components/auth/AuthDivider';
import AuthField from '../components/auth/AuthField';
import AuthPageTitle from '../components/auth/AuthPageTitle';
import SocialLoginButton from '../components/auth/SocialLoginButton';
import { LOCAL_STORAGE_KEYS } from '../constants/key';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { loginSchema } from '../schemas/authSchema';
import type { LoginFormValues } from '../schemas/authSchema';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEYS.accessToken);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await postSignin(values);
      setItem(response.data.accessToken);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setSubmitError('로그인에 실패했습니다. 입력 정보를 다시 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-black opacity-95 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <AuthPageTitle title="로그인" onBack={() => navigate(-1)} />

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <SocialLoginButton label="구글 로그인" />

            <AuthDivider />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <AuthField
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={touchedFields.email ? errors.email?.message : undefined}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <AuthField
                  type="password"
                  placeholder="비밀번호를 입력해주세요!"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={touchedFields.password ? errors.password?.message : undefined}
                />
              )}
            />

            {submitError && <p className="text-sm text-red-500">{submitError}</p>}

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full py-3 rounded-md font-medium transition-colors ${
                isValid && !isSubmitting
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default LoginPage;
