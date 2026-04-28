import type { ReactNode } from 'react';

interface SignupStepThreeProps {
  nicknameField: ReactNode;
  submitError: string | null;
  isStepThreeValid: boolean;
  isSubmitting: boolean;
}

const SignupStepThree = ({
  nicknameField,
  submitError,
  isStepThreeValid,
  isSubmitting,
}: SignupStepThreeProps) => {
  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border border-gray-700 bg-zinc-900/60 p-4">
        <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white">
          👤
        </div>
        <div>
          <p className="text-sm font-medium text-white">프로필 이미지</p>
          <p className="text-xs text-gray-400">이미지 업로드 기능은 추후 구현 예정입니다.</p>
        </div>
      </div>

      {nicknameField}

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <button
        type="submit"
        disabled={!isStepThreeValid || isSubmitting}
        className={`w-full py-3 rounded-md font-medium transition-colors ${
          isStepThreeValid && !isSubmitting
            ? 'bg-pink-500 text-white hover:bg-pink-600'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? '회원가입 처리 중...' : '회원가입 완료'}
      </button>
    </>
  );
};

export default SignupStepThree;
