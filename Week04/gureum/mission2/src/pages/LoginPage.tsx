import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { postSignin } from '../api/auth';
import AuthDivider from '../components/auth/AuthDivider';
import AuthField from '../components/auth/AuthField';
import AuthPageTitle from '../components/auth/AuthPageTitle';
import AuthTopBar from '../components/auth/AuthTopBar';
import SocialLoginButton from '../components/auth/SocialLoginButton';
import { LOCAL_STORAGE_KEYS } from '../constants/key';
import { validateLoginForm } from '../constants/loginValidation';
import { useForm } from '../hooks/useForm';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEYS.accessToken);

  const { values, touched, errors, isFormValid, getFieldProps } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLoginForm,
  });

  const emailProps = getFieldProps('email');
  const passwordProps = getFieldProps('password');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

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
    <div className="min-h-screen bg-black flex flex-col">
      <AuthTopBar onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/signup')} />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <AuthPageTitle title="로그인" onBack={() => navigate(-1)} />

          <form onSubmit={handleLogin} className="space-y-6">
            <SocialLoginButton label="구글 로그인" />

            <AuthDivider />

            <AuthField
              type="email"
              placeholder="이메일을 입력해주세요!"
              value={emailProps.value}
              onChange={emailProps.onChange}
              onBlur={emailProps.onBlur}
              error={touched.email ? errors.email : undefined}
            />

            <AuthField
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              value={passwordProps.value}
              onChange={passwordProps.onChange}
              onBlur={passwordProps.onBlur}
              error={touched.password ? errors.password : undefined}
            />

            {submitError && <p className="text-sm text-red-500">{submitError}</p>}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 rounded-md font-medium transition-colors ${
                isFormValid && !isSubmitting
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
