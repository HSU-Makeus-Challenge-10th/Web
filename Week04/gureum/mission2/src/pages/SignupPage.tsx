import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { postSignup } from '../api/auth';
import AuthPageTitle from '../components/auth/AuthPageTitle';
import AuthTopBar from '../components/auth/AuthTopBar';
import AuthField from '../components/auth/AuthField';
import { useForm } from '../hooks/useForm';

interface SignupValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const validateSignupForm = (values: SignupValues) => {
  const errors: Partial<Record<keyof SignupValues, string>> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!emailRegex.test(values.email)) {
    errors.email = '유효하지 않은 이메일 형식입니다.';
  }

  if (!values.password.trim()) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (values.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { values, touched, errors, isFormValid, getFieldProps } = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateSignupForm,
  });

  const emailProps = getFieldProps('email');
  const passwordProps = getFieldProps('password');
  const confirmPasswordProps = getFieldProps('confirmPassword');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await postSignup({
        email: values.email,
        password: values.password,
        name: values.email.split('@')[0] || 'user',
      });

      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AuthTopBar onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/signup')} />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <AuthPageTitle title="회원가입" onBack={() => navigate(-1)} />

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <AuthField
              type="password"
              placeholder="비밀번호를 다시 입력해주세요!"
              value={confirmPasswordProps.value}
              onChange={confirmPasswordProps.onChange}
              onBlur={confirmPasswordProps.onBlur}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
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
              {isSubmitting ? '회원가입 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
