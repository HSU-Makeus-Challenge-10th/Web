import type { ReactNode } from 'react';

interface SignupStepOneProps {
  emailField: ReactNode;
  isStepOneValid: boolean;
  onNext: () => void;
}

const SignupStepOne = ({ emailField, isStepOneValid, onNext }: SignupStepOneProps) => {
  return (
    <>
      {emailField}

      <button
        type="button"
        onClick={onNext}
        disabled={!isStepOneValid}
        className={`w-full py-3 rounded-md font-medium transition-colors ${
          isStepOneValid
            ? 'bg-pink-500 text-white hover:bg-pink-600'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </>
  );
};

export default SignupStepOne;
