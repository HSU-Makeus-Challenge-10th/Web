import type { UseFormRegister, FieldError } from 'react-hook-form';
import Button from '../../../../components/button/Button';
import Input from '../../../../components/input/Input';
import GoogleLoginButton from '../../../auth/components/GoogleLoginButton';
import type { SignUpFormValues } from '../../../../types/auth/signup';

interface EmailStepProps {
  register: UseFormRegister<SignUpFormValues>;
  error?: FieldError;
  email?: string;
  onNext: () => void;
}

const EmailStep = ({ register, error, email, onNext }: EmailStepProps) => {
  return (
    <>
      <GoogleLoginButton />

      <div className="flex flex-col gap-3">
        <Input
          placeholder="이메일을 입력해주세요!"
          type="email"
          error={error?.message}
          {...register('email')}
        />

        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="mt-3"
          onClick={onNext}
          disabled={!!error || !email}
        >
          다음
        </Button>
      </div>
    </>
  );
};

export default EmailStep;
