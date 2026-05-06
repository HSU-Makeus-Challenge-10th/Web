import type { ReactNode } from 'react';

interface SignupStepTwoProps {
  passwordField: ReactNode;
  confirmPasswordField: ReactNode;
  isStepTwoValid: boolean;
  onNext: () => void;
}

const SignupStepTwo = ({
  passwordField,
  confirmPasswordField,
  isStepTwoValid,
  onNext,
}: SignupStepTwoProps) => {
  return (
    <>
      {passwordField}
      {confirmPasswordField}

      <button
        type="button"
        onClick={onNext}
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
  );
};

export default SignupStepTwo;
