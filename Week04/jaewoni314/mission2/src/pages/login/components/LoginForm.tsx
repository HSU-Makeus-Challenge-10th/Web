import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import { useLoginForm } from '../../../hooks/useForm';
import type { LoginFormValues } from '../../../utils/validate';

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { register, handleSubmit, errors, isValid, isDirty } = useLoginForm();

  return (
    <>
      <Button variant="secondary" fullWidth className="mb-4">
        구글 로그인
      </Button>

      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 border-t border-gray-700" />
        <span className="text-gray-400 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-700" />
      </div>

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
