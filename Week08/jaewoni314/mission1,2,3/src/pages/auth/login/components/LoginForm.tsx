import Button from '../../../../components/button/Button';
import Input from '../../../../components/input/Input';
import GoogleLoginButton from '../../../auth/components/GoogleLoginButton';
import { useLoginForm } from '../hooks/useLoginForm';
import type { LoginData } from '../../../../types/auth/login';

interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { register, handleSubmit, errors, isValid, isDirty } = useLoginForm();

  return (
    <>
      <GoogleLoginButton />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          placeholder="이메일을 입력해주세요!"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          placeholder="비밀번호를 입력해주세요!"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="secondary"
          fullWidth
          className="mt-3"
          disabled={!isValid || !isDirty}
        >
          로그인
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
