import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import type { SignUpFormValues } from '../../../types/auth/signup';

interface PasswordStepProps {
  email: string;
  register: UseFormRegister<SignUpFormValues>;
  errors: FieldErrors<SignUpFormValues>;
  password: string;
  passwordConfirm: string;
  onNext: () => void;
}

const PasswordStep = ({
  email,
  register,
  errors,
  password,
  passwordConfirm,
  onNext,
}: PasswordStepProps) => {
  const passwordMismatch =
    !!password && !!passwordConfirm && password !== passwordConfirm;

  const isValid =
    !errors.password &&
    !errors.passwordConfirm &&
    password &&
    passwordConfirm &&
    !passwordMismatch;

  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-white mb-2">{email}</p>
        <Input
          placeholder="비밀번호를 입력해주세요!"
          type="password"
          showPasswordToggle={true}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          placeholder="비밀번호를 다시 입력해주세요!"
          type="password"
          showPasswordToggle={true}
          error={
            errors.passwordConfirm?.message ||
            (passwordMismatch ? '비밀번호가 일치하지 않습니다.' : '')
          }
          {...register('passwordConfirm')}
        />

        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="mt-3"
          onClick={onNext}
          disabled={!isValid}
        >
          다음
        </Button>
      </div>
    </>
  );
};

export default PasswordStep;
