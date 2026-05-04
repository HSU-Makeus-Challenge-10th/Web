import type {
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import { User } from 'lucide-react';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import type {
  SignUpFormValues,
  SignUpRequestBody,
} from '../../../types/auth/signup';

interface ProfileStepProps {
  register: UseFormRegister<SignUpFormValues>;
  errors: FieldErrors<SignUpFormValues>;
  name?: string;
  trigger: UseFormTrigger<SignUpFormValues>;
  watch: UseFormWatch<SignUpFormValues>;
  onComplete: (data: SignUpRequestBody) => void;
}

export default function ProfileStep({
  register,
  errors,
  name,
  trigger,
  watch,
  onComplete,
}: ProfileStepProps) {
  const isValid = !errors.name && name && name.length > 0;

  const handleComplete = async () => {
    const isProfileValid = await trigger(['name']);
    if (isProfileValid) {
      const formData = watch();
      onComplete({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400" />
        </div>
      </div>

      <div className="w-full space-y-4">
        <Input
          placeholder="이름"
          {...register('name', { required: '이름을 입력해주세요' })}
          error={errors.name?.message}
        />

        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="mt-3"
          onClick={handleComplete}
          disabled={!isValid}
        >
          회원가입 완료
        </Button>
      </div>
    </div>
  );
}
