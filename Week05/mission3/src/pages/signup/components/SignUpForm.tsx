import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import { signUpSchema } from '../../../utils/validate';
import type {
  SignUpFormValues,
  SignUpRequestBody,
} from '../../../types/auth/signup';
import Animation from '../../../components/animation/Animation';
import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';
import ProfileStep from './ProfileStep';

interface SignUpFormProps {
  onComplete: (data: SignUpRequestBody) => void;
}

const SignUpForm = ({ onComplete }: SignUpFormProps) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const {
    register,
    watch,
    formState: { errors },
    trigger,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isEmailValid = await trigger('email');
      if (isEmailValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isPasswordValid = await trigger(['password', 'passwordConfirm']);
      if (isPasswordValid) setCurrentStep(3);
    }
  };

  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return (
        <EmailStep
          register={register}
          error={errors.email}
          email={watch('email')}
          onNext={handleNextStep}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <PasswordStep
          email={watch('email')}
          register={register}
          errors={errors}
          password={watch('password')}
          passwordConfirm={watch('passwordConfirm')}
          onNext={handleNextStep}
        />
      );
    }

    return (
      <ProfileStep
        register={register}
        errors={errors}
        name={watch('name')}
        trigger={trigger}
        watch={watch}
        onComplete={onComplete}
      />
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <Animation key={currentStep}>{renderCurrentStep()}</Animation>
      </AnimatePresence>
    </div>
  );
};

export default SignUpForm;
